// Portable pre-publish invariants: no Glaze SDK needed, runs on CI.
// Encodes the project's red lines as executable assertions.
/* global console, process */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const failures = [];
const check = (name, cond) => {
  console.log(`${cond ? "ok" : "FAIL"}  ${name}`);
  if (!cond) failures.push(name);
};

// 1. Corpus integrity
const db = new DatabaseSync("data/led_full.sqlite", { readOnly: true });
check("entries=42380", db.prepare("SELECT COUNT(*) AS n FROM entries").get().n === 42380);
check("topics=866", db.prepare("SELECT COUNT(*) AS n FROM topics").get().n === 866);
check("no empty headwords", db.prepare("SELECT COUNT(*) AS n FROM entries WHERE hwd IS NULL OR hwd=''").get().n === 0);
check("corpus placeholders filtered at query time",
  readFileSync("main/handlers/dictionary.ts", "utf8").includes("NOT LIKE '(no%'"));

// 2. Guide coverage: every file on disk in exactly one journey, no dupes
const src = readFileSync("renderer/main/home-view.tsx", "utf8");
const journeys = [...src.matchAll(/files: \[(.*?)\]/g)].flatMap((m) =>
  [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1].toLowerCase()));
const disk = readdirSync("data/help").filter((f) => f.endsWith(".htm")).map((f) => f.toLowerCase());
check("49 help pages listed once each",
  journeys.length === 49 && new Set(journeys).size === 49 && disk.every((f) => journeys.includes(f)));
for (const f of disk) {
  const html = readFileSync(`data/help/${f}`, "utf8");
  const heads = [...html.matchAll(/<(h1|h2|h3)[^>]*>(.*?)<\/\1>/gis)].map((m) => m[2].replace(/<[^>]+>/g, "").trim());
  if (heads.length !== new Set(heads).size) { check(`no duplicate headings in ${f}`, false); break; }
}
check("no duplicate headings in help pages", !failures.some((f) => f.startsWith("no duplicate headings")));

// 3. Branding + style red lines in source
check('no blue badges', !src.includes('color="blue"') && !src.includes("? \"blue\""));
check("no retired brand hex", !/007FA3|003057/.test(src));
check("no UI em dashes", !/toast\.\w+\(`[^`]*—/.test(src));

// 4. Shipping assets
check("app icons present", existsSync("app-icon.png") && existsSync("app-icon.icns"));
check("README + LICENSE present", existsSync("README.md") && existsSync("LICENSE"));

if (failures.length) { console.error(`\n${failures.length} failing invariant(s)`); process.exit(1); }
console.log("\nall invariants hold");
