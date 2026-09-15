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
check("every help page listed once each",
  journeys.length === disk.length && new Set(journeys).size === disk.length &&
  disk.every((f) => journeys.includes(f)) && journeys.every((f) => disk.includes(f)));
check("no leftover CD-ROM walkthroughs",
  disk.every((f) => !/What follows describes/i.test(readFileSync(`data/help/${f}`, "utf8"))));
const broken = [];
for (const f of disk) {
  const html = readFileSync(`data/help/${f}`, "utf8");
  const heads = [...html.matchAll(/<(h1|h2|h3)[^>]*>(.*?)<\/\1>/gis)].map((m) => m[2].replace(/<[^>]+>/g, "").trim());
  if (heads.length !== new Set(heads).size) { check(`no duplicate headings in ${f}`, false); break; }
  for (const m of html.matchAll(/href="([^"]+)"/gi)) {
    const href = m[1];
    if (/^(https?:|mailto:|coach:|#)/i.test(href)) continue;
    const target = href.split("#")[0];
    if (target && /\.html?$/i.test(target) && !disk.includes(target.toLowerCase())) {
      broken.push(`${f} -> ${target}`);
    }
  }
}
check("no duplicate headings in help pages", !failures.some((f) => f.startsWith("no duplicate headings")));
check("help links resolve", broken.length === 0);

// Parent before child, related pages together — the side panel walks this
// flattened order. Relative pairs (not the full list) so journeys can grow.
const idx = (f) => journeys.indexOf(f);
const before = (a, b) => idx(a) >= 0 && idx(b) >= 0 && idx(a) < idx(b);
check("search before its specialized searches",
  before("search.htm", "dictionarysearch.htm") &&
  before("search.htm", "multimediasearch.htm") &&
  before("search.htm", "subjectsearch.htm"));
check("pronunciation before pronunciation search", before("pronunciation.htm", "pronunciationsearch.htm"));
check("word origins before origin search", before("wordorigins.htm", "wordoriginsearch.htm"));
check("examples before phrase bank", before("examples.htm", "phrasebank.htm"));
check("exam coach before exam guides", before("examcoach.htm", "fce.htm") && before("fce.htm", "exercises.htm"));
check("activator hub before its walkthroughs",
  before("activatormenu.htm", "howtheactivatorisorganized.htm") &&
  before("howtheactivatorisorganized.htm", "puttingyourideasintowords.htm") &&
  before("puttingyourideasintowords.htm", "choosingtherightwordwhenwriting.htm"));
check("copy sits with printing", Math.abs(idx("copy.htm") - idx("printing.htm")) === 1);
check("contents and introduction open the catalogue", idx("index.htm") === 0 && idx("introduction.htm") === 1);

const cdRomTitles = disk.filter((f) => {
  const t = /<title>(.*?)<\/title>/is.exec(readFileSync(`data/help/${f}`, "utf8"));
  const title = t ? t[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
  return /about menu|help contents|web\/email|LONGMAN Writing Assistant|Exams Coach help/i.test(title);
});
check("no leftover CD-ROM catalogue titles", cdRomTitles.length === 0);

// 3. Branding + style red lines in source
check('no blue badges', !src.includes('color="blue"') && !src.includes("? \"blue\""));
check("no retired brand hex", !/007FA3|003057/.test(src));
check("no UI em dashes", !/toast\.\w+\(`[^`]*—/.test(src));

// 4. Shipping assets
check("app icons present", existsSync("app-icon.png") && existsSync("app-icon.icns"));
check("README + LICENSE present", existsSync("README.md") && existsSync("LICENSE"));

if (failures.length) { console.error(`\n${failures.length} failing invariant(s)`); process.exit(1); }
console.log("\nall invariants hold");
