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

// The old Dictionary help page used a layout table; it is now a semantic,
// responsive list. The frequency reference remains a real accessible table.
const dictionaryMenu = readFileSync("data/help/dictmenu.htm", "utf8");
const dictionaryMenuLinks = [...dictionaryMenu.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1].toLowerCase());
check("dictionary guide menu is a responsive list, not a layout table",
  /<ul class="guide-link-grid">/i.test(dictionaryMenu) && !/<table\b/i.test(dictionaryMenu) && dictionaryMenuLinks.length === 11 && dictionaryMenuLinks.every((f) => disk.includes(f)));
const frequencyGuide = readFileSync("data/help/wordfrequency.htm", "utf8");
check("frequency table has caption and scoped headers",
  /<caption>/i.test(frequencyGuide) && /<th scope="col">/i.test(frequencyGuide) &&
  [...frequencyGuide.matchAll(/<th scope="row">/gi)].length === 6 &&
  [...frequencyGuide.matchAll(/<td>/gi)].length === 6);
check("compact Guide table text remains legible in dark mode",
  /\.led-guide-html th,[\s\S]*?color:\s*var\(--fg\)/.test(readFileSync("renderer/styles.css", "utf8")) &&
  /\.dark \.led-guide-html tbody th\[scope="row"\][\s\S]*?color:\s*#9fb4d9/.test(readFileSync("renderer/styles.css", "utf8")));
const styleSource = readFileSync("renderer/styles.css", "utf8");
check("guide tables and menu grid have responsive styles",
  /\.led-guide-html table[\s\S]*?width:\s*100%/.test(styleSource) &&
  /\.led-guide-html \.guide-link-grid[\s\S]*?grid-template-columns/.test(styleSource));
check("compact master/detail panes have list and detail states",
  /led-compact-split\.led-compact-list/.test(styleSource) &&
  /led-compact-split\.led-compact-detail/.test(styleSource) &&
  (src.match(/className=\{`h-full min-h-0 led-compact-split/g) ?? []).length === 3);
check("compact Dictionary starts on the populated headword list",
  /export function HomeView\(\) \{\s*const compactPane = useCompactPane\(\);/.test(src));
check("compact detail panes provide visible back-to-list navigation",
  (src.match(/<CompactBack label=/g) ?? []).length === 3 &&
  /<span>\{label\}<\/span>/.test(src) &&
  src.includes("if (r.length === 0) compactPane.showList()"));
check("compact breakpoint matches compact CSS and pane hook",
  /COMPACT_LAYOUT_MAX_WIDTH = 640/.test(readFileSync("renderer/main/compact-layout.ts", "utf8")) &&
  /@media \(max-width: 640px\)/.test(styleSource));
check("compact toolbar stacks controls without fixed-height clipping",
  /\.led-main-toolbar-row[\s\S]*?height:\s*auto !important/.test(styleSource) &&
  src.includes("led-main-toolbar-content") && src.includes("led-main-toolbar-actions"));

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
// UI tones are identified by ear, so each needs its own pitch, and each must be
// listed in SFX_TONES or its surface pays a decode on the first press.
const toneMap = new Map(
  [...src.matchAll(/^ {2}(\w+): ([\d.]+),? \/\//gm)].map(([, n, f]) => [n, parseFloat(f)])
);
check("every UI tone has a distinct pitch",
  new Set(toneMap.values()).size === toneMap.size);
// A tone the click path references but the map never parsed would otherwise
// throw here and crash the whole run with an opaque TypeError.
const named = [...src.matchAll(/playBlip\(SFX\.(\w+)(?:, ([\d.]+))?\)/g)];
const unknown = [...new Set(named.map(([, n]) => n).filter((n) => !toneMap.has(n)))];
check("every referenced tone is declared in SFX", unknown.length === 0);
const preloaded = new Set([.../const SFX_TONES[\s\S]*?\];/.exec(src)[0]
  .matchAll(/"(\w+)", ([\d.]+)/g)]
  .filter(([, n]) => toneMap.has(n))
  .map(([, n, d]) => `${toneMap.get(n)}/${d}/0.04`));
const unpreset = named
  .map(([, n, d]) => `${toneMap.get(n)}/${d || "0.1"}/0.04`)
  .filter((k) => !preloaded.has(k));
check("every tone a click path plays is pre-decoded", unpreset.length === 0);

// 4. Shipping assets
check("app icons present", existsSync("app-icon.png") && existsSync("app-icon.icns"));
check("README + LICENSE present", existsSync("README.md") && existsSync("LICENSE"));
// Every image the README embeds must exist, so a renamed screenshot cannot
// silently become a broken image on the repo landing page.
const readme = readFileSync("README.md", "utf8");
const missing = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)]
  .map((m) => m[1])
  .filter((p) => !/^https?:/i.test(p) && !existsSync(p));
check("README image references resolve", missing.length === 0);

if (failures.length) { console.error(`\n${failures.length} failing invariant(s)`); process.exit(1); }
console.log("\nall invariants hold");
