import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";
import fs from "node:fs/promises";
import Module from "node:module";
import { boundedInteger, cleanString, normalizedQuery, normalizedString, normalizedStrings, onlineDictionarySlug } from "../main/handlers/input.ts";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const dbPath = path.join(projectRoot, "data/led_full.sqlite");
const db = new DatabaseSync(dbPath, { readOnly: true });
const handlerPath = path.join(projectRoot, "main/handlers/dictionary.ts");
const bundled = await build({
  entryPoints: [handlerPath],
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
  logLevel: "silent",
  plugins: [{
    name: "test-backend-logger",
    setup(builder) {
      builder.onResolve({ filter: /^@glaze\/core\/backend$/ }, () => ({ path: "backend", namespace: "test-logger" }));
      builder.onLoad({ filter: /.*/, namespace: "test-logger" }, () => ({
        contents: "export const logger={info(){},warn(){},error(){}};",
        loader: "js",
      }));
      builder.onLoad({ filter: /dictionary\.ts$/ }, async (args) => ({
        contents: (await fs.readFile(args.path, "utf8")).replaceAll("import.meta.url", JSON.stringify(pathToFileURL(args.path).href)),
        loader: "ts",
      }));
    },
  }],
});
const handlerModule = new Module(handlerPath);
handlerModule.filename = handlerPath;
handlerModule.paths = Module._nodeModulePaths(path.dirname(handlerPath));
handlerModule._compile(bundled.outputFiles[0].text, handlerPath);
const { dictionaryHandlers } = handlerModule.exports as { dictionaryHandlers: typeof import("../main/handlers/dictionary.ts").dictionaryHandlers };

test("bounded result limits never become unbounded, fractional or exceed their cap", () => {
  const limit = (value: unknown) => boundedInteger(value, 50, 1000);
  const prepared = db.prepare("SELECT hwd FROM entries ORDER BY hwd_lower LIMIT ?");

  assert.equal(prepared.all(limit(-1)).length, 0);
  assert.equal(prepared.all(limit(0)).length, 0);
  assert.equal(prepared.all(limit(0.5)).length, 0);
  assert.equal(prepared.all(limit(Number.NaN)).length, 50);
  assert.equal(prepared.all(limit(Number.POSITIVE_INFINITY)).length, 50);
  assert.equal(prepared.all(limit("-1")).length, 50);
  assert.equal(prepared.all(limit(1.9)).length, 1);
  assert.equal(prepared.all(limit(50_000)).length, 1000);
});

test("zero is preserved for optional page sizes while invalid values use safe defaults", () => {
  assert.equal(boundedInteger(0, 1000, 2000), 0);
  assert.equal(boundedInteger(-8, 1000, 2000), 0);
  assert.equal(boundedInteger(null, 1000, 2000), 1000);
  assert.equal(boundedInteger("5", 1000, 2000), 1000);
});

test("normalized strings reject wrong IPC types and preserve wildcard literals safely", () => {
  assert.equal(cleanString("  GoBsmAcKeD  "), "GoBsmAcKeD");
  assert.equal(cleanString("x".repeat(257)), "");
  assert.equal(normalizedString("  GoBsmAcKeD  "), "gobsmacked");
  assert.equal(normalizedString("x".repeat(257)), "");
  assert.equal(onlineDictionarySlug(" Class A "), "class-a");
  assert.equal(onlineDictionarySlug("New\tYork"), "new-york");
  assert.equal(onlineDictionarySlug("café"), "");
  assert.equal(onlineDictionarySlug("../../etc/passwd"), "");
  assert.equal(onlineDictionarySlug("."), "");
  assert.equal(onlineDictionarySlug(".."), "");
  assert.equal(onlineDictionarySlug("a".repeat(129)), "");
  assert.equal(onlineDictionarySlug("javascript:alert(1)"), "");
  assert.equal(normalizedQuery("  GOBSMACKED "), "gobsmacked");
  assert.equal(normalizedQuery(null), "");
  assert.equal(normalizedQuery(42), null);
  assert.equal(normalizedQuery("a".repeat(257)), null);
  assert.equal(onlineDictionarySlug(42), "");
  assert.equal(normalizedString(null), "");
  assert.equal(normalizedString(42), "");
  const query = normalizedString("%_\\");
  const escaped = query.replace(/[%_\\]/g, (c) => `\\${c}`) + "%";
  assert.equal(db.prepare("SELECT count(*) AS n FROM entries WHERE hwd_lower LIKE ? ESCAPE '\\'").get(escaped).n, 0);
});

test("word arrays ignore malformed members, deduplicate and respect SQLite parameter cap", () => {
  assert.deepEqual(normalizedStrings("ACCEPT", 30), []);
  assert.deepEqual(normalizedStrings([" ACCEPT ", null, 7, "accept", ""], 30), ["accept"]);
  const words = normalizedStrings(Array.from({ length: 150 }, (_, index) => `word-${index}`), 30);
  assert.equal(words.length, 30);
  assert.equal(normalizedStrings(Array(1_000_000).fill("")).length, 0);
  assert.deepEqual(normalizedStrings(["x".repeat(257), "school"], 30), ["school"]);
  assert.deepEqual(normalizedStrings(Array(150).fill("duplicate").concat("late-word"), 2), ["duplicate", "late-word"]);
  assert.equal(normalizedStrings(Array(1_000_000).fill("duplicate").concat("late-word"), 2).length, 1);
  assert.deepEqual(normalizedStrings(["a", "b"], Number.MAX_SAFE_INTEGER), ["a", "b"]);
  assert.doesNotThrow(() => db.prepare(`SELECT hwd_lower FROM entries WHERE hwd_lower IN (${words.map(() => "?").join(",")})`).all(...words));
});

test("real corpus queries remain exact for headword/topic fixtures", () => {
  assert.equal(db.prepare("SELECT hwd FROM entries WHERE hwd_lower=? LIMIT ?").get(normalizedString(" Gobsmacked "), boundedInteger(10, 50, 1000)).hwd, "gobsmacked");
  assert.equal(db.prepare("SELECT topic FROM topics WHERE topic_lower LIKE ? ESCAPE '\\' LIMIT ?").get(normalizedString("accept").replace(/[%_\\]/g, (c) => `\\${c}`) + "%", boundedInteger(5, 1000, 2000)).topic, "ACCEPT");
});

test("production search handler clamps negative, fractional and oversized limits on real corpus", async () => {
  assert.equal((await dictionaryHandlers.search({ query: "", limit: -1 })).length, 0);
  assert.equal((await dictionaryHandlers.search({ query: "", limit: 0 })).length, 0);
  assert.equal((await dictionaryHandlers.search({ query: "", limit: 1.5 })).length, 1);
  assert.equal((await dictionaryHandlers.search({ query: "", limit: 50_000 })).length, 1000);
  assert.equal((await dictionaryHandlers.search({ query: "gobsmacked", limit: 1 })).length, 1);
  assert.deepEqual(await dictionaryHandlers.search(null), (await dictionaryHandlers.search({ query: "", limit: 50 })).slice(0, 50));
});

test("production handlers safely handle malformed IPC payloads", async () => {
  assert.equal(await dictionaryHandlers.getEntry(null), null);
  assert.equal(await dictionaryHandlers.getEntry({ id: -1 }), null);
  assert.equal(await dictionaryHandlers.getEntry({ id: 1.5 }), null);
  assert.equal(await dictionaryHandlers.getEntry({ hwd: 42 }), null);
  assert.equal(await dictionaryHandlers.getEntry({ hwd: "gobsmacked".repeat(100) }), null);
  assert.deepEqual(await dictionaryHandlers.search({ query: "%" }), []);
  assert.deepEqual(await dictionaryHandlers.search({ query: "_" }), []);
  assert.deepEqual(await dictionaryHandlers.search({ query: 42 }), []);
  assert.deepEqual(await dictionaryHandlers.search({ query: "x".repeat(257) }), []);
  assert.deepEqual(await dictionaryHandlers.topics({ query: 42 }), []);
  assert.deepEqual(await dictionaryHandlers.topics({ query: "x".repeat(257) }), []);
  assert.equal(await dictionaryHandlers.getEntry({ id: Number.MAX_SAFE_INTEGER + 1 }), null);
  assert.equal(await dictionaryHandlers.getEntry({ id: -1, hwd: "gobsmacked" }), null);
  assert.equal((await dictionaryHandlers.getEntry({ id: 15537 }))?.hwd, "gobsmacked");
  assert.equal(await dictionaryHandlers.image(null), null);
  assert.equal(await dictionaryHandlers.image({ id: 42 }), null);
  assert.equal(await dictionaryHandlers.image({ id: "../../package.json" }), null);
  assert.equal(await dictionaryHandlers.image({ id: ".." }), null);
  assert.equal(await dictionaryHandlers.image({ id: "/etc/passwd" }), null);
  assert.equal(await dictionaryHandlers.image({ id: "00247019.jpg\\n" }), null);
  assert.equal(await dictionaryHandlers.image({ id: `${"1".repeat(1000)}.jpg` }), null);
  assert.equal(await dictionaryHandlers.audio(null), null);
  assert.deepEqual(await dictionaryHandlers.topics({ query: "accept", limit: -1 }), []);
  assert.deepEqual(await dictionaryHandlers.topics({ query: 42, limit: 1 }), []);
  assert.equal(await dictionaryHandlers.helpPage(null), null);
  assert.equal(await dictionaryHandlers.helpPage({ file: 42 }), null);
  assert.deepEqual(await dictionaryHandlers.topics(null), (await dictionaryHandlers.topics({ query: "", limit: 1000 })).slice(0, 1000));
  assert.deepEqual(await dictionaryHandlers.topicEntries({ words: "not-an-array" }), []);
  assert.deepEqual(await dictionaryHandlers.topicEntries({ words: ["ACCEPT", null, 42, "accept", ""] }), await dictionaryHandlers.topicEntries({ words: ["accept"] }));
  assert.equal(await dictionaryHandlers.helpPage(null), null);
  assert.equal(await dictionaryHandlers.helpPage({ file: 42 }), null);
});

test("production image handler safely serves an existing real JPEG and rejects traversal", async () => {
  const candidates = db.prepare("SELECT id, html FROM entries WHERE html LIKE ? LIMIT 100").all("%preview/filesystem.cff!/%") as { id: number; html: string }[];
  let fixture: { id: number; previewId: string } | null = null;
  for (const candidate of candidates) {
    const previewId = /preview\/filesystem\.cff!\/(\d+\.jpg)/.exec(candidate.html)?.[1];
    if (previewId && existsSync(path.join(projectRoot, "data/images", previewId))) {
      fixture = { id: candidate.id, previewId };
      break;
    }
  }
  assert.ok(fixture, "fixture with a valid bundled preview should exist in corpus");
  const entry = await dictionaryHandlers.getEntry({ id: fixture.id });
  assert.equal(entry?.previewId, fixture.previewId);
  const image = await dictionaryHandlers.image({ id: fixture.previewId });
  assert.ok(image?.startsWith("data:image/jpeg;base64,"));
  assert.equal(await dictionaryHandlers.image({ id: "../../package.json" }), null);
  assert.equal(await dictionaryHandlers.image({ id: 42 }), null);
});

test.after(() => db.close());
