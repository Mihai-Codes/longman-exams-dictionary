import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { logger } from "@glaze/core/backend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Entry = {
  hwd: string;
  pron: string;
  pos: string;
  def: string;
  html: string;
  previewId: string | null;
  top1000: boolean;
};

// Preview illustration id embedded in entry HTML:
//   sk://fs/2.0/data/package/preview/filesystem.cff!/00247019.jpg
const PREVIEW_RE = /preview\/filesystem\.cff!\/(\d+\.jpg)/;

// --- US pronunciation audio (PRONUS, recovered from disc) -----------------
// pronus_word_lookup.txt maps disc index words (with variant/version suffixes
// like abandon1, ab1, -central1004a) to 0028xxxx.mp3 files. Headwords join via
// normalized keys: strip version tags + trailing digits, then try the
// hyphenated and spaced forms (a-posteriori -> "a posteriori").
let audioMap: Map<string, string> | null = null;

function audioKeys(word: string): string[] {
  const out = new Set<string>();
  const base = word
    .replace(/(new\d*|\d{3,}[a-z]?\d*)$/, "")
    .replace(/\d+$/, "")
    .replace(/-+$/, "");
  if (!base) return [];
  out.add(base);
  if (base.includes("-")) out.add(base.replace(/-/g, " "));
  if (/-s-/.test(base)) out.add(base.replace(/-s-/g, "'s "));
  return [...out];
}

function loadAudioMap(): Map<string, string> {
  if (audioMap) return audioMap;
  audioMap = new Map();
  const candidates = [
    path.join(__dirname, "..", "..", "data", "audio", "pronus_word_lookup.txt"),
    path.join(__dirname, "..", "..", "..", "sources", "data", "audio", "pronus_word_lookup.txt"),
    path.join(process.cwd(), "data", "audio", "pronus_word_lookup.txt"),
  ];
  for (const p of candidates) {
    try {
      if (!fs.existsSync(p)) continue;
      const raw = fs.readFileSync(p, "utf-8");
      for (const line of raw.split("\n")) {
        const tab = line.indexOf("\t");
        if (tab < 0) continue;
        const word = line.slice(0, tab).trim().toLowerCase();
        const file = line.slice(tab + 1).trim();
        if (!word || !file) continue;
        for (const key of audioKeys(word)) {
          if (!audioMap.has(key)) audioMap.set(key, file);
        }
      }
      logger.info("dictionary", `Audio map: ${audioMap.size} keys from ${p}`);
      break;
    } catch {
      /* try next candidate */
    }
  }
  return audioMap;
}

function audioCandidates(file: string): string[] {
  return [
    path.join(__dirname, "..", "..", "data", "audio", "sound", file),
    path.join(__dirname, "..", "..", "..", "sources", "data", "audio", "sound", file),
    path.join(process.cwd(), "data", "audio", "sound", file),
  ];
}

// --- Help pages (LED help system, recovered from led_help.chm) ------------
function helpDirs(): string[] {
  return [
    path.join(__dirname, "..", "..", "data", "help"),
    path.join(__dirname, "..", "..", "..", "sources", "data", "help"),
    path.join(process.cwd(), "data", "help"),
  ];
}

function helpDir(): string | null {
  for (const p of helpDirs()) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return p;
    } catch {
      /* try next */
    }
  }
  return null;
}

function safeHelpFile(file: string): string | null {
  const safe = (file || "").replace(/[^0-9a-zA-Z._-]/g, "");
  if (!safe || safe.includes("..") || !(safe.endsWith(".htm") || safe.endsWith(".html"))) return null;
  return safe;
}

function helpTitle(html: string, fallback: string): string {
  const m = /<title>(.*?)<\/title>/is.exec(html);
  const t = m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
  // Some CHM pages use the filename as their <title> — fall back to the
  // basename so the catalogue never shows "popupmenu.htm".
  const raw = t && !/\.(htm|html)$/i.test(t) ? t : fallback.replace(/\.(htm|html)$/i, "");
  // CD titles are inconsistent ("about menu", "CAE") — sentence-case the
  // first letter so the list reads as one catalogue. Single source: both
  // helpList and helpPage go through here.
  return raw.length > 1 ? raw[0].toUpperCase() + raw.slice(1) : raw.toUpperCase();
}

function previewOf(html: string): string | null {
  const m = PREVIEW_RE.exec(html);
  return m ? m[1] : null;
}

// Preview JPEGs live in data/images/<id>. 191 of them were truncated by
// unreadable disc sectors at build time (no SOI..EOI markers) — a single
// memoized validator so corrupt bytes are never served and the UI never
// shows a broken-image glyph; those entries simply have no illustration.
const imagePathCache = new Map<string, string | null>();
function findImage(id: string): string | null {
  const safe = (id || "").replace(/[^0-9a-zA-Z.]/g, "");
  if (!safe) return null;
  const hit = imagePathCache.get(safe);
  if (hit !== undefined) return hit;
  const candidates = [
    path.join(__dirname, "..", "..", "data", "images", safe),
    path.join(__dirname, "..", "..", "..", "sources", "data", "images", safe),
    path.join(process.cwd(), "data", "images", safe),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const fd = fs.openSync(p, "r");
        try {
          const head = Buffer.alloc(2);
          fs.readSync(fd, head, 0, 2, 0);
          const tail = Buffer.alloc(64 * 1024);
          const n = fs.readSync(fd, tail, 0, tail.length, Math.max(0, fs.fstatSync(fd).size - tail.length));
          const ok = head[0] === 0xff && head[1] === 0xd8 && tail.subarray(0, n).includes(Buffer.from([0xff, 0xd9]));
          const found = ok ? p : null;
          imagePathCache.set(safe, found);
          return found;
        } finally {
          fs.closeSync(fd);
        }
      }
    } catch {
      /* try next */
    }
  }
  imagePathCache.set(safe, null);
  return null;
}

function validPreviewId(html: string): string | null {
  const id = previewOf(html);
  return id && findImage(id) ? id : null;
}

function rowToEntry(r: Record<string, unknown>): Entry {
  const html = String(r["html"] ?? "");
  return {
    hwd: String(r["hwd"] ?? ""),
    pron: String(r["pron"] ?? ""),
    pos: String(r["pos"] ?? ""),
    def: String(r["def"] ?? ""),
    html,
    previewId: validPreviewId(html),
    top1000: r["top1000"] === 1 || r["top1000"] === true,
  };
}

// --- SQLite (full 42,380) with JSON fallback -------------------------------

let db: DatabaseSync | null = null;
let dbFailed = false;
let jsonCache: Entry[] | null = null;
let jsonLower: string[] | null = null;

function dbPath(): string | null {
  const candidates = [
    path.join(__dirname, "..", "..", "data", "led_full.sqlite"),
    path.join(__dirname, "..", "..", "..", "sources", "data", "led_full.sqlite"),
    path.join(process.cwd(), "data", "led_full.sqlite"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      /* ignore */
    }
  }
  return null;
}

function openDb(): DatabaseSync | null {
  if (db || dbFailed) return db;
  const p = dbPath();
  if (!p) {
    dbFailed = true;
    return null;
  }
  try {
    db = new DatabaseSync(p, { readOnly: true });
    const n = (db.prepare("SELECT count(*) AS n FROM entries").get() as { n: number }).n;
    logger.info("dictionary", `SQLite open: ${n} entries from ${p}`);
    return db;
  } catch (e) {
    logger.error("dictionary", `SQLite open failed: ${String(e)} — JSON fallback`);
    dbFailed = true;
    return null;
  }
}

function loadJson(): Entry[] {
  if (jsonCache) return jsonCache;
  const candidates = [
    path.join(__dirname, "..", "..", "data", "led_entries.json"),
    path.join(process.cwd(), "data", "led_entries.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, "utf-8")) as Omit<Entry, "previewId">[];
        jsonCache = raw.map((e) => ({ ...e, previewId: validPreviewId(e.html) }));
        jsonLower = jsonCache.map((e) => e.hwd.toLowerCase());
        logger.info("dictionary", `JSON fallback: ${jsonCache.length} entries from ${p}`);
        return jsonCache;
      }
    } catch (e) {
      logger.error("dictionary", `JSON load failed ${p}: ${String(e)}`);
    }
  }
  jsonCache = [];
  jsonLower = [];
  return jsonCache;
}

function ftsQuery(q: string): string {
  // "bench press" -> '"bench"* "press"*' (prefix per token, quoted)
  const toks = q
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
  return toks.map((t) => `"${t.replace(/"/g, "")}"*`).join(" ");
}

function searchJson(q: string, limit: number) {
  const entries = loadJson();
  const lowers = jsonLower!;
  if (!q) return entries.slice(0, limit).map((e, i) => ({ id: i, hwd: e.hwd, pron: e.pron, pos: e.pos, def: e.def }));
  const out: { idx: number; score: number; e: Entry }[] = [];
  for (let i = 0; i < entries.length; i++) {
    const h = lowers[i];
    let score = -1;
    if (h === q) score = 0;
    else if (h.startsWith(q)) score = 1;
    else if (h.includes(q)) score = 2;
    else if (entries[i].def.toLowerCase().includes(q)) score = 3;
    if (score >= 0) out.push({ idx: i, score, e: entries[i] });
  }
  out.sort((a, b) => a.score - b.score || a.e.hwd.localeCompare(b.e.hwd));
  return out.slice(0, limit).map((r) => ({ id: r.idx, hwd: r.e.hwd, pron: r.e.pron, pos: r.e.pos, def: r.e.def }));
}

export const dictionaryHandlers = {
  search: async (params: { query: string; limit?: number }) => {
    const q = (params.query || "").trim().toLowerCase();
    // Paged browsing (empty/short queries walk the A-Z list) needs headroom
    // past one screen; exact/prefix paths stay index-cheap at any limit.
    const limit = Math.min(params.limit ?? 50, 1000);
    const d = openDb();
    if (!d) return searchJson(q, limit);
    try {
      if (!q) {
        return (d.prepare("SELECT id, hwd, pron, pos, def FROM entries ORDER BY hwd_lower LIMIT ?").all(limit) as Record<string, unknown>[]).map((r) => ({
          id: r["id"],
          hwd: r["hwd"],
          pron: r["pron"],
          pos: r["pos"],
          def: r["def"],
        }));
      }
      // 1) exact headword
      const exact = d.prepare("SELECT id, hwd, pron, pos, def FROM entries WHERE hwd_lower = ? LIMIT ?").all(q, limit) as Record<string, unknown>[];
      // 2) headword prefix
      const pref = d.prepare("SELECT id, hwd, pron, pos, def FROM entries WHERE hwd_lower LIKE ? ESCAPE '\\' AND hwd_lower != ? ORDER BY hwd_lower LIMIT ?").all(
        q.replace(/[%_\\]/g, (c) => `\\${c}`) + "%",
        q,
        limit,
      ) as Record<string, unknown>[];
      const seen = new Set<unknown>([...exact, ...pref].map((r) => r["id"]));
      // 2b) inflected form ("went" -> go, "children" -> child): single words only
      if (exact.length + pref.length < limit && !q.includes(" ")) {
        try {
          const infl = d.prepare(
            "SELECT e.id AS id, e.hwd AS hwd, e.pron AS pron, e.pos AS pos, e.def AS def FROM inflections i JOIN entries e ON e.id = i.entry_id WHERE i.form_lower = ? LIMIT ?",
          ).all(q, limit) as Record<string, unknown>[];
          for (const r of infl) {
            if (!seen.has(r["id"])) {
              seen.add(r["id"]);
              pref.push(r);
            }
          }
        } catch {
          /* no inflections table — FTS still covers */
        }
      }
      let rest: Record<string, unknown>[] = [];
      if (exact.length + pref.length < limit) {
        try {
          rest = d.prepare(
            "SELECT e.id AS id, e.hwd AS hwd, e.pron AS pron, e.pos AS pos, e.def AS def FROM entries_fts f JOIN entries e ON e.id = f.rowid WHERE entries_fts MATCH ? ORDER BY bm25(entries_fts) LIMIT ?",
          ).all(ftsQuery(q), limit * 2) as Record<string, unknown>[];
        } catch {
          rest = [];
        }
        rest = rest.filter((r) => !seen.has(r["id"]));
      }
      return [...exact, ...pref, ...rest].slice(0, limit).map((r) => ({ id: r["id"], hwd: r["hwd"], pron: r["pron"], pos: r["pos"], def: r["def"] }));
    } catch (e) {
      logger.error("dictionary", `search failed, JSON fallback: ${String(e)}`);
      return searchJson(q, limit);
    }
  },

  getEntry: async (params: { id: number } | { hwd: string }) => {
    const d = openDb();
    if (d) {
      try {
        if ("id" in params && typeof params.id === "number") {
          const r = d.prepare(
            "SELECT e.hwd AS hwd, e.pron AS pron, e.pos AS pos, e.def AS def, e.html AS html, (f.s LIKE '%1%' OR f.w LIKE '%1%') AS top1000 FROM entries e LEFT JOIN wordfreq f ON f.hwd_lower = e.hwd_lower WHERE e.id = ?",
          ).get(params.id) as Record<string, unknown> | undefined;
          return r ? rowToEntry(r) : null;
        }
        if ("hwd" in params) {
          const r = d.prepare(
            "SELECT e.hwd AS hwd, e.pron AS pron, e.pos AS pos, e.def AS def, e.html AS html, (f.s LIKE '%1%' OR f.w LIKE '%1%') AS top1000 FROM entries e LEFT JOIN wordfreq f ON f.hwd_lower = e.hwd_lower WHERE e.hwd_lower = ? LIMIT 1",
          ).get(params.hwd.toLowerCase()) as Record<string, unknown> | undefined;
          return r ? rowToEntry(r) : null;
        }
      } catch (e) {
        logger.error("dictionary", `getEntry failed: ${String(e)}`);
      }
    }
    const entries = loadJson();
    if ("id" in params && typeof params.id === "number") return entries[params.id] ?? null;
    if ("hwd" in params) return entries.find((e) => e.hwd.toLowerCase() === params.hwd.toLowerCase()) ?? null;
    return null;
  },

  stats: async () => {
    const d = openDb();
    const total = d ? (d.prepare("SELECT count(*) AS n FROM entries").get() as { n: number }).n : loadJson().length;
    return {
      totalEntries: total,
      source: "Longman Exams Dictionary (2006) — For Upper Intermediate – Advanced Learners",
      publisher: "Pearson Longman",
      features: [
        "212,000 words, phrases and meanings",
        "160,000 examples",
        "10,000 synonyms/antonyms/word families",
        "Longman Exams Coach (35h interactive exercises)",
        "Topic Activator & Essay Activator",
      ],
    };
  },

  image: async (params: { id: string }): Promise<string | null> => {
    // Preview JPEG extracted from the disc at build time (see findImage —
    // truncated files validate to null and are never served).
    const p = findImage(params.id || "");
    if (!p) return null;
    try {
      return `data:image/jpeg;base64,${fs.readFileSync(p).toString("base64")}`;
    } catch {
      return null;
    }
  },

  audio: async (params: { hwd: string }): Promise<string | null> => {
    // US pronunciation MP3 recovered from the disc: data/audio/sound/<file>
    const q = (params.hwd || "").trim().toLowerCase();
    if (!q) return null;
    const file = loadAudioMap().get(q);
    if (!file) return null;
    const safe = file.replace(/[^0-9a-zA-Z.]/g, "");
    if (!safe) return null;
    for (const p of audioCandidates(safe)) {
      try {
        if (fs.existsSync(p)) {
          const buf = fs.readFileSync(p);
          return `data:audio/mpeg;base64,${buf.toString("base64")}`;
        }
      } catch {
        /* try next */
      }
    }
    return null;
  },

  helpList: async (): Promise<{ file: string; title: string }[]> => {
    const dir = helpDir();
    if (!dir) return [];
    try {
      return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".htm") || f.endsWith(".html"))
        .sort()
        .map((f) => {
          try {
            const html = fs.readFileSync(path.join(dir, f), "utf-8");
            return { file: f, title: helpTitle(html, f) };
          } catch {
            return { file: f, title: f };
          }
        });
    } catch {
      return [];
    }
  },

  helpPage: async (params: { file: string }): Promise<{ file: string; title: string; html: string } | null> => {
    const dir = helpDir();
    const safe = safeHelpFile(params.file || "");
    if (!dir || !safe) return null;
    try {
      let html = fs.readFileSync(path.join(dir, safe), "utf-8");
      // Discard <img ...> tags from the old CHM. The Glaze Guide is a
      // read-only article view — inline illustrations belong with the
      // topic, not inside a running procedure. Any remaining GIF reference
      // (none on this disc) would land here too. Same for <link ...>
      // stylesheets: every page references ldocehelp.css, which isn't on
      // the disc — leaving it fires a failed request per article and risks
      // 2006 Windows styling winning over the Guide's own voice.
      html = html.replace(/<img[^>]*>/gi, "");
      html = html.replace(/<link[^>]*>/gi, "");
      // Wrap bare URLs (not already inside an <a>) so they become clickable.
      // Preceded by start-of-string, whitespace, or > (end of HTML tag) — but
      // never by " ' = or : so URLs inside href="..." are never double-linked.
      html = html.replace(/(^|[\s>])(https?:\/\/[^\s<>"']+)/gim, (_, before, url) => {
        const escaped = url.replace(/"/g, "&quot;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
        return before + `<a href="${escaped}" target="_blank" rel="noopener noreferrer" class="url-link text-blue-600 hover:text-blue-800 underline">${escaped}</a>`;
      });
      // Rewrite intra-help links to a help: scheme the Guide view intercepts;
      // pages absent from the CHM surface as an honest notice client-side.
      html = html.replace(/(<a[^>]*href=")([^"#:\s]+)(#[^"]*)?("[^>]*>)/gi, (_m, pre, href, frag, post) => {
        const target = href.split("/").pop() || "";
        if (!/\.html?$/i.test(target)) return _m;
        return `${pre}help:${target}${frag || ""}${post}`;
      });
      return { file: safe, title: helpTitle(html, safe), html };
    } catch {
      return null;
    }
  },

  thesaurus: async (params: { hwd: string }): Promise<{ assoc: string; gloss: string }[]> => {
    const d = openDb();
    if (!d) return [];
    try {
      return d.prepare("SELECT assoc, gloss FROM thesaurus WHERE hwd_lower = ? ORDER BY assoc LIMIT 30").all(
        (params.hwd || "").toLowerCase(),
      ) as { assoc: string; gloss: string }[];
    } catch {
      return [];
    }
  },

  phrases: async (params: { hwd: string }): Promise<string[]> => {
    const d = openDb();
    if (!d) return [];
    try {
      const rows = d.prepare("SELECT phrase FROM phrases WHERE hwd_lower = ? LIMIT 60").all(
        (params.hwd || "").toLowerCase(),
      ) as { phrase: string }[];
      return rows.map((r) => r.phrase);
    } catch {
      return [];
    }
  },

  corpus: async (params: { hwd: string }): Promise<{ source: string; sentence: string }[]> => {
    const d = openDb();
    if (!d) return [];
    try {
      // "(no examples)" placeholder rows never leave the backend — an empty
      // section reads as a bug, and the client can't tell filler from text.
      return d.prepare("SELECT source, sentence FROM corpus WHERE hwd_lower = ? AND TRIM(sentence) <> '' AND TRIM(sentence) NOT LIKE '(no%' LIMIT 12").all(
        (params.hwd || "").toLowerCase(),
      ) as { source: string; sentence: string }[];
    } catch {
      return [];
    }
  },

  verb: async (params: { hwd: string }): Promise<{ simple_form: string; past: string; past_part: string } | null> => {
    const d = openDb();
    if (!d) return null;
    try {
      const r = d.prepare("SELECT simple_form, past, past_part FROM verb WHERE hwd_lower = ? LIMIT 1").get(
        (params.hwd || "").toLowerCase(),
      ) as { simple_form: string; past: string; past_part: string } | undefined;
      return r ?? null;
    } catch {
      return null;
    }
  },

  errors: async (params: { hwd: string }): Promise<{ bad: string; good: string; info: string }[]> => {
    const d = openDb();
    if (!d) return [];
    try {
      return d.prepare("SELECT bad, good, info FROM errors WHERE hwd_lower = ? LIMIT 6").all(
        (params.hwd || "").toLowerCase(),
      ) as { bad: string; good: string; info: string }[];
    } catch {
      return [];
    }
  },

  topics: async (params: { query: string; limit?: number }): Promise<{ topic: string; related: string[] }[]> => {
    const d = openDb();
    if (!d) return [];
    const limit = Math.min(params.limit ?? 1000, 2000);
    const q = (params.query || "").trim().toLowerCase();
    try {
      const rows = q
        ? (d.prepare("SELECT topic, related FROM topics WHERE topic_lower LIKE ? ESCAPE '\\' ORDER BY topic LIMIT ?").all(
            q.replace(/[%_\\]/g, (c) => `\\${c}`) + "%",
            limit,
          ) as { topic: string; related: string }[])
        : (d.prepare("SELECT topic, related FROM topics ORDER BY topic LIMIT ?").all(limit) as {
            topic: string;
            related: string;
          }[]);
      return rows.map((r) => {
        let related: string[] = [];
        try {
          related = JSON.parse(r.related) as string[];
        } catch {
          /* keep empty */
        }
        return { topic: r.topic, related };
      });
    } catch {
      return [];
    }
  },

  // Related-word glosses for the Coach detail pane: one batched lookup so
  // each word shows its part of speech + short definition, not just a chip.
  topicEntries: async (params: { words: string[] }): Promise<{ hwd: string; pos: string; def: string; top1000: boolean }[]> => {
    const d = openDb();
    const words = [...new Set((params.words || []).map((w) => (w || "").toLowerCase()))].filter(Boolean).slice(0, 30);
    if (!d || words.length === 0) return [];
    try {
      const rows = d.prepare(`SELECT e.hwd_lower AS k, e.hwd AS hwd, e.pos AS pos, e.def AS def, (f.s LIKE '%1%' OR f.w LIKE '%1%') AS top1000 FROM entries e LEFT JOIN wordfreq f ON f.hwd_lower = e.hwd_lower WHERE e.hwd_lower IN (${words.map(() => "?").join(",")})`).all(
        ...words,
      ) as { k: string; hwd: string; pos: string; def: string; top1000: number }[];
      const byK = new Map<string, { k: string; hwd: string; pos: string; def: string; top1000: number }>();
      for (const r of rows) {
        const prev = byK.get(r.k);
        // Senses disagree: a word counts as Top 1000 if any sense is.
        if (!prev || (!prev.top1000 && r.top1000)) byK.set(r.k, r);
      }
      return words.flatMap((w) => {
        const r = byK.get(w);
        return r ? [{ hwd: r.hwd, pos: r.pos, def: r.def, top1000: !!r.top1000 }] : [];
      });
    } catch {
      return [];
    }
  },
};
