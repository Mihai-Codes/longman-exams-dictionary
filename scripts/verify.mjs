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
// Guidance pages speak for this app alone — no legacy-platform framing.
// copyright + acknowledgements keep the 2006 legal notice and the original
// production credit roles ("CD-ROM development" is a job title, not copy).
const LEGAL_PAGES = new Set(["copyright.htm", "acknowledgements.htm"]);
const legacy = disk.filter((f) => !LEGAL_PAGES.has(f)
  && /\bCD-?ROM\b|original CD|tools-button|Guide button|audio coach|Hide text|on the disc|from the disc/i
    .test(readFileSync(`data/help/${f}`, "utf8")));
check("no CD-ROM or legacy-UI wording in guidance pages", legacy.length === 0);
// Guidance tells you what you CAN do. Absence-listing ("there is no X") reads
// as apology and implies a feature the reader should have expected.
const absent = disk.filter((f) => !LEGAL_PAGES.has(f)
  && /\bthere (is|are) no\b|\bthis (app|dictionary) has no\b|\bno separate\b|not included\b/i
    .test(readFileSync(`data/help/${f}`, "utf8")));
check("guidance pages lead with what the app does", absent.length === 0);
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
check("search before dictionary search", before("search.htm", "dictionarysearch.htm"));
check("examples before phrase bank", before("examples.htm", "phrasebank.htm"));
check("exam coach before exam guides", before("examcoach.htm", "fce.htm"));
check("pronunciation sits with the other entry skills",
  before("pronunciation.htm", "wordfrequency.htm") && before("pronunciation.htm", "pictures.htm"));
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
// The footer is a status strip, not a second navigation: it must not name a
// toolbar menu, and must not repeat a claim the About dialog already owns.
// Its only child div is self-closing, so the first </div> ends the footer.
const footer = /className="app-footer[\s\S]*?<\/div>/.exec(src)?.[0] ?? "";
check("footer present", footer.length > 0);
check("footer does not repeat a nav menu name", !/Exams Coach/.test(footer));
check("'Fully offline' claimed once", (src.match(/Fully offline/g) ?? []).length === 1);
// Guide paragraph rhythm is a deliberate accessibility call (ragged-right, no
// indent), not a whim — see the "Paragraph rhythm" block in styles.css. These
// keep justify and first-line-indent from creeping back into the rule that
// governs every Guide page.
const css = readFileSync("renderer/styles.css", "utf8");
const guideP = /\.led-guide-html\s+p\s*\{([^}]*)\}/.exec(css)?.[1] ?? "";
check("guide prose rule found", guideP.length > 0);
check("guide prose is left-aligned, not justified", !/text-align:\s*justify/.test(guideP));
// Read the indent value outright: an earlier lookahead form flagged
// `text-indent: 0` (the correct value) as a violation.
const guideIndent = /text-indent:\s*([^;}]+)/.exec(guideP)?.[1]?.trim();
check("guide paragraphs space by margin, not first-line indent",
  guideIndent === undefined || guideIndent === "0");
// The article wrapper stays free of [&_p]: spacing/alignment variants so this
// rule in styles.css is the single source of truth for paragraph rhythm.
check("guide paragraph rhythm lives only in styles.css",
  !/\[_p\]:(?:text-justify|text-align|text-indent)/.test(src));

// 4. Shipping assets
check("app icons present", existsSync("app-icon.png") && existsSync("app-icon.icns"));
check("README + LICENSE present", existsSync("README.md") && existsSync("LICENSE"));

if (failures.length) { console.error(`\n${failures.length} failing invariant(s)`); process.exit(1); }
console.log("\nall invariants hold");
