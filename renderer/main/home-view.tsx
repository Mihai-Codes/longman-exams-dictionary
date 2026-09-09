import { useEffect, useLayoutEffect, useState, useMemo, useRef, type RefObject, type ReactNode } from "react";
import {
  Button,
  Input,
  ScrollArea,
  SplitView,
  List,
  Text,
  Badge,
  EmptyState,
  Separator,
  Dialog,
  TabsRoot,
  Tabs,
  TabsTrigger,
  Toolbar,
  ToolbarRow,
  ToolbarContent,
  ToolbarTitle,
  ToolbarDescription,
  ToolbarActions,
  toast,
} from "@glaze/core/components";
import {
  SearchIcon,
  CircleXIcon,
  InfoIcon,
  BookOpenIcon,
  Volume2Icon,
  ImageIcon,
  FileTextIcon,
  QuoteIcon,
  LibraryIcon,
  FlameIcon,
  TrophyIcon,
  StarIcon,
  GraduationCapIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ZapIcon,
} from "lucide-react";

type SearchResult = { id: number; hwd: string; pron: string; pos: string; def: string };
type Entry = { hwd: string; pron: string; pos: string; def: string; html: string; previewId: string | null; top1000: boolean };
// Everything the body AND the Study panel need for one headword — fetched
// once in HomeView (single source) instead of twice in two places.
type StudyData = {
  synonyms: { assoc: string; gloss: string }[];
  phrases: string[];
  corpus: { source: string; sentence: string }[];
  verb: { simple_form: string; past: string; past_part: string } | null;
  mistakes: { bad: string; good: string; info: string }[];
};
const EMPTY_STUDY: StudyData = { synonyms: [], phrases: [], corpus: [], verb: null, mistakes: [] };
type Stats = {
  totalEntries: number;
  source: string;
  publisher: string;
  features: string[];
  volume: string;
  note: string;
};

function cleanHtml(html: string): string {
  return html
    .replace(/<\?SK[^?]*\?>/g, "")
    // CD wraps the inflected headword inside examples in <xblphrsensehwd>
    // (click-to-select behavior). Unwrap to keep the word, or sentences
    // read "They their attempt...". All other xbl tags are toolbar/behavior
    // buttons with no readable text, so those are still stripped below.
    .replace(/<xblphrsensehwd[^>]*>(.*?)<\/xbl[^>]*>/gs, "$1")
    .replace(/<xbl[^>]*>.*?<\/xbl[^>]*>/gs, "")
    .replace(/<xbl[^>]*\/>/g, "")
    .replace(/chrome:\/\/led\/[^"]*/g, "")
    .replace(/src="[^"]*btnflcplier\.gif[^"]*"/g, `class="hidden"`)
    .replace(/<fthwd>/g, `<span class="font-semibold text-[1.25em] tracking-tight">`)
    .replace(/<\/fthwd>/g, `</span>`)
    .replace(/<ftdef>/g, `<span>`)
    .replace(/<\/ftdef>/g, `</span>`)
    .replace(/<ftexa>/g, `<span>`)
    .replace(/<\/ftexa>/g, `</span>`);
}

type Gamification = { count: number; lastDate: string; xp: number; level: number; seen: string[] };

const SEEN_CAP = 5000;

// Single typed bridge to the backend — one cast lives here instead of at
// every call site.
type GlazeIpc = {
  invoke: (c: string, p: unknown) => Promise<unknown>;
  on: (c: string, cb: (params: unknown) => void) => () => void;
};
function glazeIpc(): GlazeIpc {
  return (window as unknown as { glazeAPI: { glaze: { ipc: GlazeIpc } } }).glazeAPI.glaze.ipc;
}
async function invoke<T>(channel: string, params?: unknown): Promise<T> {
  return (await glazeIpc().invoke(channel, params)) as T;
}

// Error-note INFO strings pack explanation + quoted examples into one run
// ("lead: 'ex1' 'ex2'"), which reads as a wall. Split the quoted examples
// onto their own lines. The quote guards skip mid-word apostrophes
// (O'CLOCK, You're), so lone apostrophes never split.
const INFO_QUOTE_RE = /(?<![A-Za-z])'.+?'(?![A-Za-z])/g;
function splitInfo(info: string): { lead: string; quotes: string[] } {
  const quotes = info.match(INFO_QUOTE_RE) ?? [];
  const lead = info.replace(INFO_QUOTE_RE, "@").split("@")[0].trim();
  return { lead, quotes };
}
function ghostFor(query: string, top: string | undefined): string {
  if (query && top && top.toLowerCase().startsWith(query.toLowerCase()) && top.length > query.length) {
    return top.slice(query.length);
  }
  return "";
}

// Word-pattern templates (COLLO) for the inspector, e.g.
// "make a hole/dent/mark etc". Display text only, capped for scanability.
function extractCollocs(html: string): string[] {
  const re = /class="COLLO"[^>]*>(.*?)<\/(?:span|div)>/gs;
  const outs: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const txt = m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    if (txt && !outs.includes(txt)) outs.push(txt);
    if (outs.length >= 8) break;
  }
  return outs;
}

function freshGamification(): Gamification {
  return { count: 1, lastDate: new Date().toDateString(), xp: 0, level: 1, seen: [] as string[] };
}

function loadGamification(): Gamification {
  const fresh = freshGamification();
  try {
    const s = localStorage.getItem("led-streak-v2");
    if (!s) return fresh;
    const p = JSON.parse(s);
    return {
      ...fresh,
      ...p,
      seen: Array.isArray(p.seen) ? p.seen.filter((x: unknown): x is string => typeof x === "string") : [],
    };
  } catch {
    return fresh;
  }
}

// Single Duolingo-style progression hook: +1 XP only the FIRST time a word
// is looked up — revisits earn nothing (Memrise-style review decay taken to
// zero, and it keeps "Mastered N words" honest). +10 bonus exactly when the
// 10th, 50th and 100th unique word lands.
function useGamification() {
  const [streak, setStreak] = useState<Gamification>(loadGamification);
  const [celebrate, setCelebrate] = useState(false);

  const lookup = (hwd: string) => {
    const key = hwd.trim().toLowerCase();
    if (!key) return;
    setStreak((prev) => {
      if (prev.seen.includes(key)) return prev;
      const today = new Date().toDateString();
      const seen = [...prev.seen, key].slice(-SEEN_CAP);
      const bonus = seen.length === 10 || seen.length === 50 || seen.length === 100 ? 10 : 0;
      const xp = prev.xp + 1 + bonus;
      const level = Math.floor(xp / 50) + 1;
      // A streak is consecutive days: a gap breaks it back to day 1.
      // (A bad stored date also resets — never grows from garbage.)
      const gap = Math.round((new Date(today).getTime() - new Date(prev.lastDate).getTime()) / 86400000);
      const next = {
        count: prev.lastDate !== today ? (gap === 1 ? prev.count + 1 : 1) : prev.count,
        lastDate: today,
        xp,
        level,
        seen,
      };
      try {
        localStorage.setItem("led-streak-v2", JSON.stringify(next));
      } catch {
        /* private mode — streak just won't persist */
      }
      if (bonus > 0) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
        toast.success(`Milestone! ${seen.length} words mastered. +10 XP bonus`);
      } else if (level > prev.level) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
        toast.success(`Level ${level} reached!`);
      } else if (prev.lastDate !== today) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
      }
      return next;
    });
  };

  // Fresh start: clears streak, XP, level and seen words. Two-tap guarded
  // at the call site — this just executes.
  const reset = () => {
    try {
      localStorage.removeItem("led-streak-v2");
    } catch {
      /* nothing stored */
    }
    setStreak(freshGamification());
  };

  return { streak, lookup, celebrate, reset };
}

let sharedCtx: AudioContext | null = null;

// One voice per surface — each menu and chrome action gets its own pitch,
// so ears can tell where they are without looking. Short sine blips.
const SFX = {
  lookup: 880, // Dictionary: word opened
  coach: 1174.7, // Exams Coach: topic / exam guide chosen
  guide: 659.3, // Guide: page opened
  guideStep: 440, // Guide: back / forward step
  tab: 523.25, // main menu switched
  motion: 740, // Motion toggle flipped
  about: 987.77, // About opened
  save: 1046.5, // word saved / unsaved
  image: 783.99, // illustration opened
  empty: 329.63, // low thud: action had nothing to show
  journey: 587.33, // Guide journey section changed
  online: 1318.5, // current entry opened on ldoceonline.com
};

function playBlip(freq = 880, dur = 0.1, vol = 0.04) {
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!sharedCtx || sharedCtx.state === "closed") sharedCtx = new Ctor();
    const ctx = sharedCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g).connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.stop(ctx.currentTime + dur + 0.03);
  } catch {
    /* no audio device — stay silent */
  }
}

function SearchInput({
  value,
  onChange,
  ghost,
  onClearGhost,
  loading,
  inputRef,
  placeholder = "Search headword or definition",
}: {
  value: string;
  onChange: (v: string) => void;
  ghost: string;
  onClearGhost: () => void;
  loading: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  placeholder?: string;
}) {
  // Delayed busy signal: searches resolve in milliseconds, so showing the
  // accent pulse immediately flashes blue on every keystroke. Only signal
  // when loading outlasts a pause (cold DB open, slow disk).
  const [showBusy, setShowBusy] = useState(false);
  useEffect(() => {
    if (!loading) {
      setShowBusy(false);
      return;
    }
    const t = setTimeout(() => setShowBusy(true), 300);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <div className="relative">
      <SearchIcon className={["absolute left-2.5 top-1/2 -translate-y-1/2 size-4 pointer-events-none", showBusy ? "text-accent animate-pulse" : "text-tertiary"].join(" ")} />
      {ghost && (
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 pointer-events-none flex items-center h-8 text-small overflow-hidden">
          <span className="invisible">{value}</span>
          <span className="text-quaternary">{ghost}</span>
          <span className="ml-1 hidden sm:inline-flex items-center gap-0.5 text-[10px] text-tertiary border border-separator rounded px-1 py-0.5 bg-well">Tab</span>
        </div>
      )}
      <Input
        ref={inputRef as never}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab" && ghost) {
            e.preventDefault();
            onChange(value + ghost);
            onClearGhost();
          }
        }}
        placeholder={placeholder}
        className="pl-8 pr-8 h-8 bg-input relative"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            onClearGhost();
            inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-control-subtle hover:bg-control flex items-center justify-center text-tertiary hover:text-primary transition-transform active:scale-90 border border-separator"
          aria-label="Clear search"
        >
          <CircleXIcon className="size-3.5" />
        </button>
      )}

    </div>
  );
}

// Top-level tab bar. A standalone Glaze Toolbar resolves the traffic-light
// inset itself — never hand-roll left padding for it.
function DictionaryTabs({
  activeTab,
  onChange,
  onAbout,
  motionIsOn,
  onToggleMotion,
}: {
  activeTab: string;
  onChange: (v: string) => void;
  onAbout: () => void;
  motionIsOn: boolean;
  onToggleMotion: () => void;
}) {
  // Glide highlight: the pill sits behind the active menu and slides on
  // click/switch (target = activeTab only — no hover tracking). Measured
  // live so it tracks real trigger boxes.
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [thumb, setThumb] = useState({ left: 0, width: 0, ready: false });
  const target = activeTab;
  useLayoutEffect(() => {
    const root = tabsRef.current;
    if (!root) return;
    const wrap = root.querySelector(`[data-tab="${target}"]`) as HTMLElement | null;
    const el = (wrap?.firstElementChild as HTMLElement | null) ?? wrap;
    if (!el) return;
    const base = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setThumb({ left: r.left - base.left, width: r.width, ready: true });
  }, [target]);
  useLayoutEffect(() => {
    const onResize = () => {
      const root = tabsRef.current;
      if (!root) return;
      const wrap = root.querySelector(`[data-tab="${target}"]`) as HTMLElement | null;
      const el = (wrap?.firstElementChild as HTMLElement | null) ?? wrap;
      if (!el) return;
      const base = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setThumb({ left: r.left - base.left, width: r.width, ready: true });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [target]);
  return (
    <Toolbar>
      <ToolbarRow>
        <ToolbarContent>
          <TabsRoot value={activeTab} onValueChange={onChange}>
            <Tabs>
              <div ref={tabsRef} className="relative flex">
                {thumb.ready && (
                  <span
                    aria-hidden
                    className="led-tab-thumb pointer-events-none absolute top-0 bottom-0 border"
                    style={{
                      left: thumb.left,
                      width: thumb.width,
                      borderRadius: "calc(var(--radius-pill) - 2px)",
                      borderColor: "var(--theme-accent)",
                      backgroundColor: "color-mix(in srgb, var(--theme-accent) 14%, transparent)",
                    }}
                  />
                )}
                <span data-tab="dictionary" className="flex">
                  <TabsTrigger value="dictionary">Dictionary</TabsTrigger>
                </span>
                <span data-tab="coach" className="flex">
                  <TabsTrigger value="coach">Exams Coach</TabsTrigger>
                </span>
                <span data-tab="guide" className="flex">
                  <TabsTrigger value="guide">Guide</TabsTrigger>
                </span>
              </div>
            </Tabs>
          </TabsRoot>
        </ToolbarContent>
        <ToolbarActions>
          <Button
            variant="transparent"
            size="small"
            title={motionIsOn ? "Motion always plays in full" : "Motion follows your Mac setting"}
            aria-label={motionIsOn ? "Turn motion effects off" : "Turn motion effects on"}
            onClick={onToggleMotion}
          >
            <ZapIcon className={["size-4", motionIsOn ? "text-amber-400" : "text-foreground/50"].join(" ")} />
            Motion
            <span className={["inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", motionIsOn ? "bg-amber-400/15 text-amber-400" : "bg-foreground/10 text-foreground/60"].join(" ")}>
              {motionIsOn ? "On" : "Auto"}
            </span>
          </Button>
          <Button variant="transparent" size="small" onClick={onAbout} aria-label="About">
            <InfoIcon className="size-4" />
            About
          </Button>
        </ToolbarActions>
      </ToolbarRow>
    </Toolbar>
  );
}


// One marker geometry for every bulleted row (Definition rows, BulletCard):
// fixed 1rem column so all body text starts at the same x. A drawn dot on
// vertical-align: middle (x-height center of the effectively rendered
// font), never a text glyph and never a hand-tuned margin: both proved
// font-sensitive (harness fallback vs production Inter measure differently).
// The size class must match the sibling text so the line box is identical.
function BulletDot({ size }: { size: "large" | "small" }) {
  return (
    <span className={`w-4 shrink-0 text-center text-tertiary select-none ${size === "large" ? "text-large" : "text-small"} leading-relaxed`} aria-hidden="true">
      <span className="inline-block size-[5px] rounded-full bg-current align-middle" />
    </span>
  );
}

// One bullet card shared by Examples and From-books-and-newspapers.
// Bullet always inline with its first line (never centered, never stacked
// above it). Every row gets a bullet (no first-row exception).
function BulletCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-well/60 border border-separator/50 px-3 py-2.5">
      <BulletDot size="small" />
      <Text variant="small" className="italic leading-relaxed">
        {children}
      </Text>
    </div>
  );
}

function EntryDetail({ entry, saved, onToggleSave, study, streak, showConfetti, onLookup }: { entry: Entry | null; saved: boolean; onToggleSave: () => void; study: StudyData; streak: { count: number; level: number; xp: number; seen: string[] }; showConfetti: boolean; onLookup: (hwd: string) => void }) {
  if (!entry) {
    return null;
  }

  const cleaned = useMemo(() => cleanHtml(entry.html), [entry.html]);
  const [showImage, setShowImage] = useState(false);
  // undefined = loading, null = no illustration, string = ready
  const [imgSrc, setImgSrc] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    setShowImage(false);
    setImgSrc(undefined);
  }, [entry.hwd]);

  // Study data arrives from HomeView (fetched once per headword for the
  // body sections) — no second fetch here.
  const { synonyms, phrases, corpus, verb, mistakes } = study;
  // Word patterns for the Study notes card (entry HTML is present from
  // the start, so this is static — plain const, no extra fetch).
  const cardCollocs = extractCollocs(entry.html);

  useEffect(() => {
    if (!showImage || !entry.previewId || imgSrc !== undefined) return;
    void (async () => {
      try {
        const url = await invoke<string | null>("dictionary:image", { id: entry.previewId });
        setImgSrc(url);
      } catch {
        setImgSrc(null);
      }
    })();
  }, [showImage, entry.previewId, imgSrc]);

  const examples = useMemo(() => {
    const re = /<div[^>]*class="EXAMPLE"[^>]*>(.*?)<\/div>/gs;
    const outs: string[] = [];
    let m: RegExpExecArray | null;
    const tmp = cleaned;
    while ((m = re.exec(tmp)) !== null) {
      let txt = m[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
      // Strip leading square/circle bullets from original LED (▪) so we only show one
      txt = txt.replace(/^[▪■•·●\s]+/, "").trim();
      txt = txt.replace(/^▪\s*/, "").trim();
      if (txt) outs.push(txt);
      if (outs.length >= 5) break;
    }
    return outs;
  }, [cleaned]);

  return (
    <div className="flex flex-col gap-4 p-6 max-w-[720px] mx-auto w-full led-entry-html">
      {/* Static sections cascade once per entry. Study-fed sections live in
          the plain wrapper below so their late arrival never replays motion
          (the double-play). `contents` keeps every section a direct flex
          item, so spacing is unchanged. */}
      <div className="contents led-waterfall">
      {/* Header — one line: headword left, streak + actions right. No wrap:
          wrapping dropped the whole action group under the word on long
          headwords, which read as a bug. */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 mr-auto">
            <Text as="h1" variant="heading1" className="tracking-tight">
              {entry.hwd}
            </Text>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {entry.pos && <Badge color="secondary" className="font-mono">{entry.pos}</Badge>}
              {entry.pron && (
                <Badge color="secondary" className="font-mono">
                  /{entry.pron}/
                </Badge>
              )}
              {entry.top1000 && <Badge color="secondary">Top 1000</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 rounded-full bg-well border border-separator px-3 py-1.5 text-small shrink-0">
              <FlameIcon className="size-4 text-support-orange" />
              <Text variant="small-strong">{streak.count}-day streak</Text>
              <Text variant="small" color="tertiary">· Level {streak.level}</Text>
              <TrophyIcon className="size-3.5 text-support-yellow" />
              <Text variant="small">{streak.xp} XP</Text>
              <Text variant="small" color="tertiary">· ★ {streak.seen.length}</Text>
              {showConfetti && <span className="animate-pulse text-small">✨</span>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <Button
                variant="transparent"
                className="active:scale-95 transition-transform"
                onClick={onToggleSave}
                aria-label={saved ? "Remove from saved words" : "Save this word"}
              >
                <span className="flex items-center gap-1.5">
                  <StarIcon className="size-4" fill={saved ? "currentColor" : "none"} />
                  {saved ? "Saved" : "Save"}
                </span>
              </Button>
              <Button
                variant="transparent"
                className="active:scale-95 transition-transform"
                onClick={() => {
                  void (async () => {
                    try {
                      const url = await invoke<string | null>("dictionary:audio", { hwd: entry.hwd });
                      if (url) {
                        await new Audio(url).play();
                        toast.success(`Playing “${entry.hwd}”`);
                        return;
                      }
                    } catch {
                      /* fall through to speech synthesis */
                    }
                    if ("speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(entry.hwd);
                      const voices = window.speechSynthesis.getVoices();
                      const gb =
                        voices.find((v) => v.lang === "en-GB" && /daniel/i.test(v.name)) ||
                        voices.find((v) => v.lang === "en-GB") ||
                        voices.find((v) => v.lang.startsWith("en-GB"));
                      if (gb) u.voice = gb;
                      u.lang = gb ? "en-GB" : "en-US";
                      u.rate = 0.9;
                      window.speechSynthesis.speak(u);
                      toast.success(`Speaking “${entry.hwd}”`);
                    } else {
                      toast.error("Speech synthesis not available");
                    }
                  })();
                }}
              >
                <span className="flex items-center gap-1.5">
                  <Volume2Icon className="size-4" />
                  Audio
                </span>
              </Button>
              <Button
                variant="transparent"
                className="active:scale-95 transition-transform"
                onClick={() => {
                  if (entry.previewId) {
                    setShowImage(true);
                    playBlip(SFX.image, 0.09);
                  } else {
                    playBlip(SFX.empty, 0.12);
                    toast.info(`No illustration for “${entry.hwd}”`);
                  }
                }}
              >
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="size-4" />
                  Image
                </span>
              </Button>
            </div>
          </div>
        </div>
        <Separator />
      </div>

      {entry.def && (
        <div className="rounded-xl bg-well border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <FileTextIcon className="size-3.5" /> Definition
          </Text>
          <div className="leading-relaxed space-y-1">
            {entry.def.split('•').map((part, i) => {
              const t = part.trim();
              if (!t) return null;
              // ml-px: card rows sit inside a 1px border; bare rows need
              // the same inset or the text columns sit 1px apart.
              return (
                <div key={i} className="flex items-start gap-2 px-3 ml-px">
                  <BulletDot size="large" />
                  <Text variant="large" className="leading-relaxed">{t}</Text>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {examples.length > 0 && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <QuoteIcon className="size-3.5" /> Examples
          </Text>
          <div className="space-y-2.5">
            {examples.map((ex, i) => (
              <BulletCard key={i}>{ex}</BulletCard>
            ))}
          </div>
        </div>
      )}

      {(entry.top1000 || cardCollocs.length > 0 || entry.previewId) && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <LibraryIcon className="size-3.5" /> Study notes
          </Text>
          <div className="space-y-2">
            {entry.top1000 && (
              <div className="flex items-center gap-1.5">
                <Badge color="secondary">Top 1000</Badge>
                <Text variant="small" color="tertiary">an exam-priority word.</Text>
              </div>
            )}
            {cardCollocs.slice(0, 4).map((c, i) => (
              <div key={i} className="flex gap-2.5 rounded-lg bg-well/60 border border-separator/50 px-3 py-2.5">
                <Text variant="small" className="leading-relaxed">
                  {c}
                </Text>
              </div>
            ))}
            {entry.previewId && (
              <Text variant="small" color="tertiary">Illustrated — tap Image above to see it.</Text>
            )}
          </div>
        </div>
      )}

      </div>
      <div className="contents">

      {verb && (verb.past || verb.past_part) && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <FileTextIcon className="size-3.5" /> Verb forms
          </Text>
          <div className="flex flex-wrap gap-1.5">
            {[verb.simple_form, verb.past, verb.past_part].filter(Boolean).map((f, i) => (
              <Badge key={i} color="secondary" className="font-mono">{f}</Badge>
            ))}
          </div>
        </div>
      )}

      {mistakes.length > 0 && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <InfoIcon className="size-3.5" /> Common mistakes
          </Text>
          <div className="space-y-2.5">
            {mistakes.slice(0, 4).map((m, i) => (
              <div key={i} className="rounded-lg bg-well/60 border border-separator/50 px-3 py-2.5 space-y-2">
                {m.bad && (
                  <div className="flex items-start gap-2">
                    <CircleXIcon className="size-4 shrink-0 mt-0.5 text-support-red" />
                    <Text variant="small" color="secondary" className="leading-relaxed">
                      <Text as="span" variant="small-strong" color="red">Don&apos;t say: </Text>
                      <span className="line-through">{m.bad}</span>
                    </Text>
                  </div>
                )}
                {m.good && (
                  <div className="flex items-start gap-2">
                    <CheckIcon className="size-4 shrink-0 mt-0.5 text-support-green" />
                    <Text variant="small" className="leading-relaxed">
                      <Text as="span" variant="small-strong" color="green">Say: </Text>
                      {m.good}
                    </Text>
                  </div>
                )}
                {m.info && (() => {
                  const { lead, quotes } = splitInfo(m.info);
                  // Bare cross-references ("See note at THINK 6") are dead
                  // text unless tappable. Make them jump to the entry.
                  const see = /^See (?:note at )?(.+?)(?:\s+\d+)?$/i.exec(lead.trim());
                  return (
                    <div className="leading-relaxed border-t border-separator/50 pt-2 space-y-1">
                      {see ? (
                        <button onClick={() => onLookup(see[1])} className="cursor-pointer" title={`Look up ${see[1].toLowerCase()}`}>
                          <Text variant="small" color="tertiary">
                            See note at <span className="underline" style={{ color: "var(--theme-accent)" }}>{see[1].toLowerCase()}{/(\s+\d+)$/.exec(lead.trim())?.[1] ?? ""}</span>
                          </Text>
                        </button>
                      ) : lead.trim() ? (
                        <Text variant="small" color="tertiary" className="leading-relaxed">
                          {lead.trim()}
                        </Text>
                      ) : null}
                      {quotes.map((q, qi) => (
                        <Text key={qi} variant="small" color="secondary" className="italic leading-relaxed block pl-4">
                          {q}
                        </Text>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {corpus.length > 0 && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <FileTextIcon className="size-3.5" /> From books and newspapers
          </Text>
          <div className="space-y-2.5">
            {corpus.slice(0, 6).map((c, i) => (
              <BulletCard key={i}>
                {c.sentence}
                {c.source ? `, ${c.source}` : ""}
              </BulletCard>
            ))}
          </div>
        </div>
      )}

      {phrases.length > 0 && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <QuoteIcon className="size-3.5" /> Phrases
          </Text>
          <div className="flex flex-wrap gap-1.5">
            {phrases.slice(0, 20).map((p, i) => (
              <Badge key={i} color="secondary">{p}</Badge>
            ))}
          </div>
        </div>
      )}

      {synonyms.length > 0 && (
        <div className="rounded-xl bg-panel border border-separator p-4">
          <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
            <LibraryIcon className="size-3.5" /> Similar words
          </Text>
          <div className="space-y-2.5">
            {synonyms.slice(0, 8).map((s, i) => (
              <div key={i} className="flex gap-2.5 rounded-lg bg-well/60 border border-separator/50 px-3 py-2.5">
                <Badge color="secondary" className="shrink-0 self-start">{s.assoc}</Badge>
                <Text variant="small" color="secondary" className="leading-relaxed">
                  {s.gloss}
                </Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opt-in bridge to the current online entry. Explicit tap only — the
          app stays offline-first; nothing is fetched without asking. */}
      <div className="flex justify-center pt-1 pb-2">
        <button
          onClick={() => {
            playBlip(SFX.online, 0.09);
            void (async () => {
              try {
                await invoke<boolean>("shell:openOnline", { hwd: entry.hwd });
              } catch {
                toast.error("Couldn't open the browser");
              }
            })();
          }}
          className="cursor-pointer"
          title="Opens ldoceonline.com in your browser (needs internet)"
        >
          <Text variant="small" color="tertiary">View current entry on <span className="underline" style={{ color: "var(--theme-accent)" }}>ldoceonline.com ↗</span></Text>
        </button>
      </div>

      </div>

      <Dialog
        open={showImage}
        onOpenChange={setShowImage}
        title={entry.hwd}
        description="Illustration from the dictionary"
      >
        <div className="flex items-center justify-center p-2">
          {imgSrc ? (
            <img src={imgSrc} alt="" className="max-w-full rounded-lg border border-separator" />
          ) : imgSrc === null ? (
            <Text variant="small" color="tertiary">No illustration for “{entry.hwd}”</Text>
          ) : (
            <Text variant="small" color="tertiary">Loading illustration…</Text>
          )}
        </div>
      </Dialog>
    </div>
  );
}

type Topic = { topic: string; related: string[] };

// Topic Activator: browse the dictionary's 866 topics, open one to see its
// related words, tap any word to look it up in the Dictionary tab.
// Exam guides (FCE…TOEFL) open the matching Guide page, like the CD's
// Exams Coach did: guide first, then practice with topic words.
const EXAM_GUIDES = [["FCE", "fce.htm"], ["CAE", "cae.htm"], ["IELTS", "ielts.htm"], ["TOEIC", "toeic.htm"], ["TOEFL", "toefl.htm"]] as const;
function CoachView({ onLookup, onOpenGuide, requestTopic, onRequestOpened }: { onLookup: (hwd: string) => void; onOpenGuide: (file: string) => void; requestTopic: string | null; onRequestOpened: () => void }) {
  const [query, setQuery] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  // Longest list in the app renders in pages of 150 — full 762-row DOM janks.
  const [visibleCount, setVisibleCount] = useState(150);
  // Glosses behind the related-word chips: fetched per selected topic.
  const [glosses, setGlosses] = useState<{ hwd: string; pos: string; def: string; top1000: boolean }[]>([]);
  const [ghost, setGhost] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await invoke<Topic[]>("dictionary:topics", { query, limit: 1000 });
        // Empty topics (no related words) are not listed — nothing to study.
        const list = (r ?? []).filter((t) => t.related.length > 0);
        setTopics(list);
        setVisibleCount(150);
        if (list.length && (!selected || !list.find((x) => x.topic === selected.topic))) {
          setSelected(list[0]);
        }
        if (list.length === 0) setSelected(null);
        setGhost(ghostFor(query, list[0]?.topic));
      } catch (e) {
        toast.error(String(e));
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  // Glosses follow the selection (same staleness guard as HomeView fetches).
  useEffect(() => {
    if (!selected) {
      setGlosses([]);
      return;
    }
    let live = true;
    setGlosses([]);
    void (async () => {
      try {
        const g = await invoke<{ hwd: string; pos: string; def: string; top1000: boolean }[]>("dictionary:topicEntries", { words: selected.related });
        if (live) setGlosses(g ?? []);
      } catch {
        /* chips without glosses remain */
      }
    })();
    return () => {
      live = false;
    };
  }, [selected?.topic]);

  // Deep-links from the Guide (coach: links): select the named topic once
  // topics are loaded. Mirrors GuideView's requestFile consumption.
  useEffect(() => {
    if (!requestTopic || topics.length === 0) return;
    const hit = topics.find((t) => t.topic.toLowerCase() === requestTopic.toLowerCase());
    if (hit) {
      setQuery("");
      setSelected(hit);
    }
    onRequestOpened();
  }, [requestTopic, topics]);

  const visibleTopics = topics.slice(0, visibleCount);

  return (
    <SplitView
      storageKey="led-coach"
      listSize={{ default: 300, min: 240, max: 440 }}
      className="h-full min-h-0"
      list={
        <ScrollArea
          className="glass-toolbar"
          toolbar={
            <div className="px-3 pb-3 pt-2 solid-pane-header">
              {/* Same Glaze rule as Headwords: with a custom toolbar the
                  title/subtitle props are ignored, so they live here. Exam
                  guides ride this fixed header — the old sticky bar painted
                  over the scrollbar thumb for the first screens of scroll. */}
              <ToolbarTitle>Topics</ToolbarTitle>
              {topics.length > 0 && (
                <ToolbarDescription>
                  {`${topics.length} topics${query ? ` for “${query}”` : ""}`}
                </ToolbarDescription>
              )}
              <div className="mt-2">
              <SearchInput
                value={query}
                onChange={setQuery}
                ghost={ghost}
                onClearGhost={() => setGhost("")}
                loading={loading}
                inputRef={inputRef}
                placeholder="Search topics"
              />
              </div>
              <div className="mt-3">
              <Text variant="small-strong" color="secondary" className="uppercase tracking-widest text-support-red">Exam guides</Text>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {EXAM_GUIDES.map(([label, file]) => (
                  <button key={file} onClick={() => { playBlip(SFX.coach, 0.09); onOpenGuide(file); }} className="cursor-pointer" title={`How the ${label} exam works`}>
                    <Badge color="secondary">{label}</Badge>
                  </button>
                ))}
              </div>
              </div>
            </div>
          }
        >
          {topics.length === 0 ? (
            <EmptyState
              title={query ? `No topics for “${query}”` : "No topics"}
              description="Try a different spelling or check your search."
              actions={
                query ? (
                  <Button variant="transparent" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
            <List.Root
              items={visibleTopics}
              selectedItem={selected}
              onSelectedItemChange={(item) => {
                setSelected(item as unknown as Topic);
                playBlip(SFX.coach, 0.09);
              }}
              getItemKey={(t: Topic) => t.topic}
            >
              {visibleTopics.map((t) => (
                <List.Item key={t.topic} item={t as any}>
                  <List.ItemContent>
                    <List.ItemTitle className="flex items-center gap-1.5">
                      <span className="truncate">{t.topic}</span>
                      <Badge size="small" color="secondary" className="shrink-0">
                        {t.related.length}
                      </Badge>
                    </List.ItemTitle>
                    <List.ItemDescription className="line-clamp-2">
                      {t.related.slice(0, 4).map((w) => w.toLowerCase()).join(" · ")}
                    </List.ItemDescription>
                  </List.ItemContent>
                  <List.ItemAccessory>
                    <BookOpenIcon className="size-3.5 text-quaternary" />
                  </List.ItemAccessory>
                </List.Item>
              ))}
            </List.Root>
            {visibleCount < topics.length && (
              <div className="p-3">
                <Button
                  variant="transparent"
                  onClick={() => setVisibleCount((c) => c + 150)}
                >
                  Show more ({topics.length - visibleCount} remaining)
                </Button>
              </div>
            )}
            </>
          )}
        </ScrollArea>
      }
    >
      <ScrollArea
        className="glass-toolbar"
      >
        <div className="px-1 pb-6 pt-4">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full p-10">
              <div className="w-14 h-14 rounded-[16px] flex items-center justify-center shadow-lg" style={{ backgroundColor: "var(--red)" }}>
                <GraduationCapIcon className="size-7" style={{ color: "#fff" }} />
              </div>
              <Text as="h3" variant="large-strong" className="mt-4">Pick a topic</Text>
              <Text variant="small" color="secondary" className="mt-1 max-w-[36ch] text-center">
                Choose a topic to see the words examiners expect around it.
              </Text>
            </div>
          ) : (
            <div key={selected.topic} className="led-detail-in flex flex-col gap-4 p-6 max-w-[720px] mx-auto w-full">
              <div className="rounded-xl bg-support-blue-10 border border-separator p-4">
                <Text variant="small-strong" color="secondary" className="uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  <LibraryIcon className="size-3.5" /> Related words
                  <Badge size="small" color="secondary" className="shrink-0">{selected.related.length}</Badge>
                </Text>
                {glosses.length > 0 ? (
                  <div className="space-y-2">
                    {glosses.map((g) => (
                      <button key={g.hwd} onClick={() => onLookup(g.hwd)} className="cursor-pointer text-left w-full">
                        <div className="flex gap-2.5 rounded-lg bg-well/60 border border-separator/50 px-3 py-2.5 items-start">
                          <div className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <Text variant="small-strong">{g.hwd}</Text>
                              {g.pos && (
                                <Badge size="small" color="secondary" className="shrink-0">
                                  {g.pos.split(",")[0].trim()}
                                </Badge>
                              )}
                              {g.top1000 && (
                                <Badge size="small" color="secondary" className="shrink-0">
                                  Top 1000
                                </Badge>
                              )}
                            </span>
                            {g.def && (
                              <Text variant="small" color="secondary" className="leading-relaxed mt-0.5 line-clamp-2">
                                {g.def}
                              </Text>
                            )}
                          </div>
                          <BookOpenIcon className="size-3.5 text-quaternary shrink-0 ml-auto mt-0.5" />
                        </div>
                      </button>
                    ))}
                    {selected.related.filter((w) => !glosses.some((g) => g.hwd.toLowerCase() === w.toLowerCase())).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selected.related
                          .filter((w) => !glosses.some((g) => g.hwd.toLowerCase() === w.toLowerCase()))
                          .map((w) => (
                            <button key={w} onClick={() => onLookup(w)} className="cursor-pointer">
                              <Badge color="secondary">{w.toLowerCase()}</Badge>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selected.related.map((w) => (
                      <button key={w} onClick={() => onLookup(w)} className="cursor-pointer">
                        <Badge color="secondary">{w.toLowerCase()}</Badge>
                      </button>
                    ))}
                  </div>
                )}
                <Text variant="small" color="tertiary" className="mt-3">
                  Tap a word to look it up in the dictionary.
                </Text>
              </div>
            </div>
          )}
        </div>
        <div className="h-6" />
      </ScrollArea>
    </SplitView>
  );
}

type HelpPage = { file: string; title: string };
type HelpArticle = { file: string; title: string; html: string };

// Guided journeys mirroring how the CD itself organized its help: exam
// guides, dictionary skills and Activator walkthroughs — not an A–Z dump.
// Every one of the 49 recovered pages lives in exactly one journey.
const GUIDE_JOURNEYS: { key: string; title: string; blurb: string; files: string[] }[] = [
  { key: "start", title: "Start here", blurb: "Find your way around the dictionary", files: ["index.htm", "introduction.htm", "menus.htm", "dictmenu.htm", "dictionarysearch.htm", "search.htm", "multimediasearch.htm", "subjectsearch.htm", "changingmode.htm", "switchingbetweenmodes.htm", "popupmode.htm", "popupmenu.htm", "settings.htm", "printing.htm"] },
  { key: "skills", title: "Dictionary skills", blurb: "Pronunciation, word sets, frequency and more", files: ["pronunciation.htm", "pronunciationsearch.htm", "syllables.htm", "wordsets.htm", "wordfrequency.htm", "wordorigins.htm", "wordoriginsearch.htm", "verbforms.htm", "examples.htm", "pictures.htm", "phrasebank.htm"] },
  { key: "exams", title: "Exam guides", blurb: "How each exam works, from the Exams Coach", files: ["examcoach.htm", "fce.htm", "cae.htm", "ielts.htm", "toeic.htm", "toefl.htm", "exercises.htm", "practice_test.htm", "hints_feedback.htm"] },
  { key: "writing", title: "Writing with the Activator", blurb: "Topic and Essay Activator walkthroughs", files: ["activatormenu.htm", "activateyourlanguage.htm", "howtheactivatorisorganized.htm", "puttingyourideasintowords.htm", "choosingtherightwordwhenwriting.htm", "choosetherightword.htm", "writinghandbook.htm", "grammarhandbook.htm", "commonerrors.htm"] },
  { key: "about", title: "About this dictionary", blurb: "Credits, copyright and support", files: ["aboutmenu.htm", "acknowledgements.htm", "copyright.htm", "copy.htm", "technicalsupport.htm", "compatiblesoftwareapplications.htm"] },
];
// Authored reading order across all journeys: catalogue lists sort by this
// rank, never by the backend's alphabetical listing.
const GUIDE_RANK = new Map<string, number>(
  GUIDE_JOURNEYS.flatMap((j) => j.files).map((f, i) => [f.toLowerCase(), i]),
);

// User guide recovered from led_help.chm on the disc. Mirrors CoachView:
// filterable list on the left, article on the right, honest states throughout.
function GuideView({ requestFile, onRequestOpened, onOpenCoach, active }: { requestFile: string | null; onRequestOpened: () => void; onOpenCoach: (topic: string | null) => void; active: boolean }) {
  const [query, setQuery] = useState("");
  const [journey, setJourney] = useState("all");
  const [pages, setPages] = useState<HelpPage[]>([]);
  const [selected, setSelected] = useState<HelpPage | null>(null);
  // undefined = loading, null = page not included, object = ready
  const [article, setArticle] = useState<HelpArticle | null | undefined>(undefined);
  const [pendingFrag, setPendingFrag] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement | null>(null);
  const guideInputRef = useRef<HTMLInputElement | null>(null);
  // Anchor at the top of the list so we can find its scroller (behavioral
  // lookup — no Glaze-internal class names) and undo mount scroll drift.
  const listTopRef = useRef<HTMLDivElement | null>(null);
  const resetListTop = () => {
    let el = listTopRef.current?.parentElement ?? null;
    while (el && el !== document.body) {
      const oy = getComputedStyle(el).overflowY;
      if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 10) {
        el.scrollTop = 0;
        break;
      }
      el = el.parentElement;
    }
  };
  // Back/forward history over opened pages (the Guide had none — the only
  // way back was leaving the tab). openPage pushes; step moves the pointer.
  const [nav, setNav] = useState<{ hist: string[]; i: number }>({ hist: [], i: -1 });
  const openPage = (f: HelpPage | null) => {
    setSelected(f);
    if (!f) return;
    setNav((n) => {
      const base = n.hist.slice(0, n.i + 1);
      if (base[base.length - 1] === f.file) return n;
      const hist = [...base, f.file];
      return { hist, i: hist.length - 1 };
    });
  };
  const step = (d: number) => {
    const i = Math.min(Math.max(nav.i + d, 0), nav.hist.length - 1);
    if (i === nav.i || nav.hist.length === 0) return;
    playBlip(SFX.guideStep, 0.08);
    const p = pages.find((pg) => pg.file === nav.hist[i]);
    if (p) {
      const j = GUIDE_JOURNEYS.find((gj) => gj.files.includes(p.file.toLowerCase()));
      if (j) setJourney(j.key);
      setQuery("");
      setSelected(p);
    }
    setNav({ hist: nav.hist, i });
  };
  // Mouse 4/5 (back/forward) and horizontal trackpad swipes walk the same
  // article history as the chevrons. stepRef is refreshed every render so
  // the handlers below never read stale state.
  const stepRef = useRef(step);
  stepRef.current = step;
  const swipeAtRef = useRef(0);
  const swipeAccumRef = useRef({ sum: 0, last: 0 });
  // macOS-standard back/forward (⌘[ / ⌘]) — also what most mouse
  // utilities send for their side buttons.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.shiftKey) return;
      if (e.key === "[") {
        e.preventDefault();
        stepRef.current(-1);
      } else if (e.key === "]") {
        e.preventDefault();
        stepRef.current(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  // OS-level two-finger swipe (forwarded by main as "guide:swipe").
  // Stubbed bridge (screenshots) has no .on — guarded, never throws.
  useEffect(() => {
    let unsub: (() => void) | null = null;
    try {
      unsub =
        glazeIpc().on?.("guide:swipe", (dir) => {
          stepRef.current(dir === "left" ? 1 : -1);
        }) ?? null;
    } catch {
      unsub = null;
    }
    return () => {
      try {
        unsub?.();
      } catch {
        /* noop */
      }
    };
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const r = await invoke<HelpPage[]>("dictionary:helpList");
        setPages(r ?? []);
        if (r && r.length) {
          openPage(r.find((p) => p.file === "index.htm") ?? r[0]);
          // List.Item scrolls a newly-selected (late) page into view on
          // mount, stranding early rows under the translucent toolbar.
          // Reset after paint — two frames, invisible to the user.
          requestAnimationFrame(() => requestAnimationFrame(resetListTop));
        }
      } catch {
        setPages([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) {
      setArticle(null);
      return;
    }
    setArticle(undefined);
    void (async () => {
      try {
        setArticle(await invoke<HelpArticle | null>("dictionary:helpPage", { file: selected.file }));
      } catch {
        setArticle(null);
      }
    })();
  }, [selected]);

  // Open requests from the Exams Coach: jump to the page's journey and
  // select it. Consumed once pages are loaded so early requests survive.
  useEffect(() => {
    if (!requestFile || pages.length === 0) return;
    const hit = pages.find((p) => p.file.toLowerCase() === requestFile.toLowerCase());
    if (hit) {
      const j = GUIDE_JOURNEYS.find((gj) => gj.files.includes(hit.file.toLowerCase()));
      if (j) setJourney(j.key);
      setQuery("");
      openPage(hit);
    }
    onRequestOpened();
  }, [requestFile, pages]);
  // Re-entering the tab (without a Coach deep-link pending) resets to the
  // All catalogue — the menu always starts where the journeys start.
  useEffect(() => {
    if (!active || requestFile) return;
    setJourney("all");
    setQuery("");
  }, [active]);

  useEffect(() => {
    if (article && pendingFrag && articleRef.current) {
      const el =
        articleRef.current.querySelector(`#${CSS.escape(pendingFrag)}`) ??
        articleRef.current.querySelector(`[name="${pendingFrag}"]`);
      el?.scrollIntoView({ block: "start" });
      setPendingFrag(null);
    }
  }, [article, pendingFrag]);

  const q = query.trim().toLowerCase();
  const journeyFiles = journey === "all" ? null : GUIDE_JOURNEYS.find((j) => j.key === journey)?.files ?? [];
  // Catalogue ranking: the backend lists pages alphabetically, but each
  // menu must read in its journey's authored order (Start here walks
  // contents to printing). One rank map, applied to every list below —
  // sections, single journeys, and search hits alike.
  const rankOf = (file: string) => {
    const i = GUIDE_RANK.get(file.toLowerCase());
    return i === undefined ? Number.MAX_SAFE_INTEGER : i;
  };
  const byRank = (a: HelpPage, b: HelpPage) => rankOf(a.file) - rankOf(b.file) || a.title.localeCompare(b.title);
  const inJourney = (journeyFiles ? pages.filter((p) => journeyFiles.includes(p.file.toLowerCase())) : pages).slice().sort(byRank);
  const journeyBlurb = journey === "all" ? undefined : GUIDE_JOURNEYS.find((j) => j.key === journey)?.blurb;
  const filtered = q
    ? inJourney.filter((p) => p.title.toLowerCase().includes(q) || p.file.toLowerCase().includes(q))
    : inJourney;
  // One journey's rows as a List — shared selection across sections, so a
  // page stays highlighted whichever section it is opened from.
  const renderGuideItems = (items: HelpPage[]) => (
    <List.Root
      items={items}
      selectedItem={selected}
      onSelectedItemChange={(item) => { openPage(item as unknown as HelpPage); playBlip(SFX.guide, 0.09); }}
      getItemKey={(t: HelpPage) => t.file}
    >
      {items.map((t) => (
        <List.Item key={t.file} item={t as any}>
          <List.ItemContent>
            <List.ItemTitle>
              {/* Native tooltip: long CD titles ("...Writing Assis|tant")
                  truncate at the panel edge — hover reveals the full one. */}
              <span className="truncate" title={t.title || t.file}>{t.title || t.file}</span>
            </List.ItemTitle>
          </List.ItemContent>
        </List.Item>
      ))}
    </List.Root>
  );
  // In "All" (no search) the catalogue is delimited by journey, so each
  // menu reads as part of its section. A journey or search flattens it.
  const showSections = journey === "all" && !q;

  // Side-button nav in one place: mousedown covers real XButton1/2, auxclick
  // catches drivers that only emit aux clicks (some Logitech mappings).
  const mouseNav = (button: number) => {
    if (button === 3) stepRef.current(-1);
    else if (button === 4) stepRef.current(1);
  };
  return (
    <div
      className="h-full min-h-0 flex flex-col"
      onMouseDown={(e) => {
        if (e.button === 3 || e.button === 4) e.preventDefault();
        mouseNav(e.button);
      }}
      onAuxClick={(e) => {
        mouseNav(e.button);
      }}
      onWheel={(e) => {
        // Two-finger swipes arrive as bursts of small wheel ticks —
        // accumulate sideways motion within one gesture; a dominant
        // horizontal run steps history exactly once (then cooldown).
        // Attached here (whole tab) so swipes work over list, chips
        // and article alike — not just the article body.
        const now = Date.now();
        if (now - swipeAccumRef.current.last > 200) swipeAccumRef.current.sum = 0;
        swipeAccumRef.current.last = now;
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.5) {
          swipeAccumRef.current.sum = 0;
          return;
        }
        swipeAccumRef.current.sum += e.deltaX;
        if (now - swipeAtRef.current < 600) return;
        if (Math.abs(swipeAccumRef.current.sum) >= 45) {
          const dir = swipeAccumRef.current.sum < 0 ? -1 : 1;
          swipeAccumRef.current.sum = 0;
          swipeAtRef.current = now;
          stepRef.current(dir);
        }
      }}
    >
    <SplitView
      storageKey="led-guide"
      listSize={{ default: 300, min: 240, max: 440 }}
      className="h-full min-h-0"
      list={
        <ScrollArea
          className="glass-toolbar"
          toolbar={
            <div className="px-3 pb-3 pt-2 solid-pane-header">
              {/* Titles live here explicitly (custom toolbar drops the props).
                  Journeys ride the fixed header like the Coach's exam guides —
                  the old sticky bar covered the scrollbar thumb. */}
              {/* Catalogue pane names what it lists — Headwords, Topics,
                  Pages — never the tab name. */}
              <ToolbarTitle>Pages</ToolbarTitle>
              <ToolbarDescription>
                {journeyBlurb ?? (filtered.length ? `${filtered.length} pages${query ? ` for “${query}”` : ""}` : "Help pages")}
              </ToolbarDescription>
              <div className="mt-2">
              <SearchInput value={query} onChange={setQuery} ghost="" onClearGhost={() => {}} loading={false} inputRef={guideInputRef} placeholder="Search guide pages" />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
              <button key="all" onClick={() => { setJourney("all"); playBlip(SFX.journey, 0.08); }} className="cursor-pointer">
                <Badge color="secondary" className={journey === "all" ? "font-semibold ring-1 ring-[var(--theme-accent)]" : undefined}>All</Badge>
              </button>
              {GUIDE_JOURNEYS.map((j) => (
                <button key={j.key} onClick={() => { setJourney(j.key); playBlip(SFX.journey, 0.08); }} className="cursor-pointer" title={j.blurb}>
                  <Badge color="secondary" className={journey === j.key ? "font-semibold ring-1 ring-[var(--theme-accent)]" : undefined}>{j.title}</Badge>
                </button>
              ))}
              </div>
            </div>
          }
        >
          {/* Scroll-top anchor for resetListTop (see above). */}
          <div ref={listTopRef} />
          {filtered.length === 0 ? (
            <EmptyState
              title={query ? `No guide pages for “${query}”` : "No guide pages"}
              description="Try a different spelling or check your search."
              actions={query ? <Button variant="transparent" onClick={() => setQuery("")}>Clear search</Button> : undefined}
            />
          ) : showSections ? (
            GUIDE_JOURNEYS.map((j) => {
              const items = pages
                .filter((p) => j.files.includes(p.file.toLowerCase()))
                .slice()
                .sort(byRank);
              if (items.length === 0) return null;
              return (
                <div key={j.key}>
                  <div className="border-y border-separator bg-well/60 px-3 py-2.5 flex flex-col gap-0.5">
                    <Text variant="small-strong" color="secondary" className="uppercase tracking-widest">
                      {j.title}
                    </Text>
                    <Text variant="small" color="tertiary">
                      {j.blurb} · {items.length} pages
                    </Text>
                  </div>
                  {renderGuideItems(items)}
                </div>
              );
            })
          ) : (
            renderGuideItems(filtered)
          )}
        </ScrollArea>
      }
    >
      {/* No title: the tab already says Guide, and each article carries its
          own heading — a third label is pure duplication. Back/forward stay. */}
      <ScrollArea
        className="guide-pane-ground"
        actions={
          <div className="flex gap-1">
            {/* Plain buttons, deliberately NOT Glaze Button: zero chrome
                (no disabled/focus/hover disc can ever paint here). step()
                itself guards the ends; unusable ones stay invisible. */}
            <button
              onClick={(e) => { step(-1); e.currentTarget.blur(); }}
              aria-label="Back"
              title="Back"
              className={nav.i <= 0 ? "invisible" : "cursor-pointer rounded-md p-1 text-tertiary hover:text-primary hover:bg-control-subtle active:scale-95 transition-all outline-none"}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              onClick={(e) => { step(1); e.currentTarget.blur(); }}
              aria-label="Forward"
              title="Forward"
              className={nav.i >= nav.hist.length - 1 ? "invisible" : "cursor-pointer rounded-md p-1 text-tertiary hover:text-primary hover:bg-control-subtle active:scale-95 transition-all outline-none"}
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        }
      >
        {article === undefined ? (
          <div className="p-6 max-w-[720px] mx-auto w-full">
            <Text variant="small" color="tertiary">Loading…</Text>
          </div>
        ) : article === null ? (
          <EmptyState
            title="Page not included on the disc"
            description="The help references a page that wasn't in led_help.chm."
          />
        ) : (
          <>
            {/* Provenance: the Guide transcribes the 2006 CD-ROM help verbatim,
                so its steps name Windows UI ("Click OK", "blue toolbar") that
                this Mac app doesn't have. One quiet line per article says so.
                Once here covers every page, since each renders this branch. */}
            <div className="mx-auto w-[calc(100%-2rem)] max-w-[720px] pt-4">
              <Text variant="small" color="tertiary">From the original 2006 CD-ROM guide. Some steps describe the Windows program.</Text>
            </div>
            <div key={article.file} className="p-6 md:p-8 mx-auto mt-2 mb-4 w-[calc(100%-2rem)] max-w-[720px] bg-popover border border-separator rounded-2xl led-detail-in">
            {/* Elevated sheet (popover surface floats above the themed window
                by design); panel's 40% alpha could never separate from the
                translucent tab bar. */}
            <div
              ref={articleRef}
              className="led-guide-html [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-5 [&_h3]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_li]:my-1 [&_li]:text-[13px] [&_li]:leading-relaxed [&_p]:my-2 [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:text-justify [&_p]:text-indent-[1.25em] [&_a]:underline [&_a]:cursor-pointer [&_img]:rounded-lg [&_img]:my-3 [&_img]:max-w-full"
              dangerouslySetInnerHTML={{ __html: article.html }}
              onClick={(e) => {
                const a = (e.target as HTMLElement).closest?.("a[href]");
                if (!a) return;
                const href = a.getAttribute("href") || "";
                if (href.startsWith("help:")) {
                  e.preventDefault();
                  const [file, frag] = href.slice(5).split("#");
                  const next = pages.find((p) => p.file.toLowerCase() === file.toLowerCase());
                  if (next) {
                    setPendingFrag(frag || null);
                    openPage(next);
                    playBlip(SFX.guide, 0.09);
                  } else {
                    toast.error("That help page wasn't included on the disc");
                  }
                } else if (href.startsWith("coach:")) {
                  e.preventDefault();
                  onOpenCoach(href.slice(6).trim() || null);
                  playBlip(SFX.coach, 0.09);
                } else if (href.startsWith("#")) {
                  e.preventDefault();
                  const id = href.slice(1);
                  const el =
                    articleRef.current?.querySelector(`#${CSS.escape(id)}`) ??
                    articleRef.current?.querySelector(`[name="${id}"]`);
                  el?.scrollIntoView({ block: "start" });
                }
              }}
            />
          </div>
          </>
        )}
      </ScrollArea>
    </SplitView>
    </div>
  );
}

export function HomeView() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  // Paged headword list (mirrors Coach topics): the backend caps rows per
  // request, so Show more refetches with a higher limit instead of slicing.
  const [dictVisible, setDictVisible] = useState(150);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [ghost, setGhost] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const [activeTab, setActiveTab] = useState("dictionary");
  // File the Exams Coach asked the Guide to open (consumed on arrival).
  const [guideRequest, setGuideRequest] = useState<string | null>(null);
  const [coachRequest, setCoachRequest] = useState<string | null>(null);
  // In-app motion override: "auto" follows the OS Reduce Motion setting,
  // "full" forces effects even under it. Footer toggle flips it.
  const [motionIsOn, setMotionIsOn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("led-motion");
      if (stored === "full" || stored === "auto") return stored === "full";
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? false
        : true;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      document.body.classList.toggle("led-motion-full", motionIsOn);
      localStorage.setItem("led-motion", motionIsOn ? "full" : "auto");
    } catch {
      /* private mode — session-only */
    }
  }, [motionIsOn]);
  // Tab glide without remounting (see note on the tab body): replay a
  // short slide-fade on every switch. Skipped for reduced motion.
  const tabBodyRef = useRef<HTMLDivElement | null>(null);
  const firstTabRender = useRef(true);
  useEffect(() => {
    if (firstTabRender.current) {
      firstTabRender.current = false;
      return;
    }
    if (!motionIsOn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    tabBodyRef.current?.animate(
      [{ opacity: 0, transform: "translateX(16px)" }, { opacity: 1, transform: "none" }],
      { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }, [activeTab]);
  const { streak, lookup, celebrate: showConfetti, reset: resetProgress } = useGamification();
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  // Single source for entry extras: one parallel fetch per headword feeds
  // the body sections and the toolbar snapshot — never fetched twice.
  const [study, setStudy] = useState<StudyData>(EMPTY_STUDY);
  useEffect(() => {
    if (!selectedEntry) {
      setStudy(EMPTY_STUDY);
      return;
    }
    const hwd = selectedEntry.hwd;
    setStudy(EMPTY_STUDY);
    // Fast selection changes (arrow-key scrolling) overlap fetches — stale
    // responses must never overwrite the current word's sections.
    let live = true;
    void (async () => {
      try {
        const [rows, phrs, corp, vb, errs] = await Promise.all([
          invoke<{ assoc: string; gloss: string }[]>("dictionary:thesaurus", { hwd }),
          invoke<string[]>("dictionary:phrases", { hwd }),
          invoke<{ source: string; sentence: string }[]>("dictionary:corpus", { hwd }),
          invoke<{ simple_form: string; past: string; past_part: string } | null>("dictionary:verb", { hwd }),
          invoke<{ bad: string; good: string; info: string }[]>("dictionary:errors", { hwd }),
        ]);
        if (!live) return;
        setStudy({
          synonyms: rows ?? [],
          phrases: phrs ?? [],
          corpus: corp ?? [],
          verb: vb ?? null,
          mistakes: errs ?? [],
        });
      } catch {
        if (live) setStudy(EMPTY_STUDY);
      }
    })();
    return () => {
      live = false;
    };
  }, [selectedEntry?.hwd]);
  // Set only by tapping a row — programmatic selects (startup, new search)
  // must stay silent and earn no XP.
  const userPicked = useRef(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  // Latest query mirror + pending auto-select timer (search perf: typing
  // must not trigger getEntry + 5 study invokes per keystroke).
  const queryRef = useRef("");
  queryRef.current = query;
  const selectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ⌘K focuses search, Spotlight-style.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const s = await invoke<Stats>("dictionary:stats");
        setStats(s);        const initial = await invoke<SearchResult[]>("dictionary:search", { query: "", limit: 150 });
        setResults(initial);
        if (initial.length) setSelected(initial[0]);
        const [h, f] = await Promise.all([invoke<string[]>("library:history"), invoke<string[]>("library:favorites")]);
        setHistory(h ?? []);
        setFavorites(f ?? []);
      } catch (e) {
        toast.error(String(e));
      }
    })();
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await invoke<SearchResult[]>("dictionary:search", { query, limit: dictVisible });
        if (queryRef.current !== query) return;
        setResults(r);
        // Predictive: ghost the rest of the top result
        setGhost(ghostFor(query, r[0]?.hwd));
        // Deferred auto-select: selecting publishes getEntry (full HTML)
        // plus 5 study invokes, so doing it per keystroke multiplies
        // backend round-trips by every character typed. Wait for a pause.
        if (selectTimer.current) clearTimeout(selectTimer.current);
        selectTimer.current = setTimeout(() => {
          if (queryRef.current !== query) return;
          setSelected((prev) => {
            if (r.length && (!prev || !r.find((x) => x.id === prev.id))) return r[0];
            if (r.length === 0) return null;
            return prev;
          });
        }, 350);
      } catch (e) {
        toast.error(String(e));
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => {
      clearTimeout(t);
      if (selectTimer.current) clearTimeout(selectTimer.current);
    };
  }, [query, dictVisible]);

  useEffect(() => {
    if (!selected) {
      setSelectedEntry(null);
      return;
    }
    // Same staleness guard as study: only the latest selection may publish
    // its entry, blip, XP and history.
    let live = true;
    void (async () => {
      try {
        const e = await invoke<Entry | null>("dictionary:getEntry", { id: selected.id });
        if (!live) return;
        setSelectedEntry(e);
        if (!userPicked.current) return;
        userPicked.current = false;
        playBlip(SFX.lookup);
        lookup(selected.hwd);
        try {
          const h = await invoke<string[]>("library:historyPush", { hwd: selected.hwd });
          if (live) setHistory(h ?? []);
        } catch {
          /* history is best-effort */
        }
      } catch (err) {
        if (live) toast.error(String(err));
      }
    })();
    return () => {
      live = false;
    };
  }, [selected?.id]);

  // Resolve a tapped word directly instead of trusting the
  // search-then-select chain: exact match wins, misses get an
  // honest notice instead of a silent blank body. Shared by Coach
  // related-words and mistake-note cross-references.
  const lookupWord = (hwd: string) => {
    userPicked.current = true;
    const q = hwd.toLowerCase();
    setQuery(q);
    setActiveTab("dictionary");
    void (async () => {
      try {
        const r = await invoke<SearchResult[]>("dictionary:search", { query: q, limit: 10 });
        const hit = r.find((x) => x.hwd.toLowerCase() === q) ?? r[0];
        if (hit) setSelected(hit);
        else toast.info(`No dictionary entry for “${hwd}”`);
      } catch {
        /* debounced search effect covers failures */
      }
    })();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Hidden drag region for window */}
      <div className="h-0 drag-region" />

      <DictionaryTabs activeTab={activeTab} onChange={(v) => { setActiveTab(v); playBlip(SFX.tab, 0.08); }} onAbout={() => { setShowAbout(true); playBlip(SFX.about, 0.1); }} motionIsOn={motionIsOn} onToggleMotion={() => { setMotionIsOn((m) => !m); playBlip(SFX.motion, 0.09); }} />

      {/* NOTE: title+description must stay SET (hidden, not removed). Glaze
          Dialog only takes the modal/portal path when trigger, title,
          description or onConfirm is present — with none of them it renders
          children inline at the top of the page on every tab. */}
      <Dialog
        open={showAbout}
        onOpenChange={setShowAbout}
        title="About"
        hideTitle
        description="Longman Exams Dictionary for upper-intermediate to advanced learners, fully offline."
        hideDescription
      >
        <div className="led-dialog-in flex flex-col items-center text-center gap-5 py-2">
          <div className="w-16 h-16 rounded-[18px] flex items-center justify-center shadow-lg" style={{ backgroundColor: "var(--red)" }}>
            <GraduationCapIcon className="size-8" style={{ color: "#fff" }} />
          </div>
          <div className="space-y-1">
            <Text as="h2" variant="heading1" className="tracking-tight">
              Longman Exams Dictionary
            </Text>
            <Text variant="small" color="secondary">
              For Upper Intermediate – Advanced Learners · Pearson
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              [stats ? stats.totalEntries.toLocaleString() : "…", "headwords offline"],
              ["212,000", "words, phrases, meanings"],
              ["160,000", "examples of natural use"],
              ["762", "topics with study words"],
            ].map(([n, label]) => (
              <div key={label} className="rounded-xl bg-well border border-separator px-3 py-2.5">
                <Text variant="large-strong">{n}</Text>
                <Text variant="small" color="tertiary" className="block mt-0.5">
                  {label}
                </Text>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (!resetArmed) {
                setResetArmed(true);
                setTimeout(() => setResetArmed(false), 3000);
                return;
              }
              setResetArmed(false);
              resetProgress();
              setShowAbout(false);
              toast.success("Learning progress reset. Fresh start!");
            }}
            className="w-full cursor-pointer rounded-xl border border-separator px-3 py-2 text-small text-tertiary transition-all active:scale-[0.98]"
            style={resetArmed ? { color: "var(--red)" } : undefined}
          >
            {resetArmed ? "Tap again to erase streak, XP and level" : "Reset learning progress"}
          </button>
          <Text variant="small" color="tertiary">
            Your key to exam success · Fully offline
          </Text>
        </div>
      </Dialog>

      {/* Tab body takes exactly the remaining space — SplitViews must never
          stretch the column and push the footer off-screen. Tab changes
          glide via Web Animations (no remount: remounting refetches lists
          and flashes the search spinner). */}
      <div ref={tabBodyRef} className="flex-1 min-h-0 flex flex-col relative">
      {/* All three tabs stay mounted — hiding instead of unmounting so
          switching never refetches lists, flashes spinners, or loses
          Guide scroll/history. */}
      <div className={activeTab === "dictionary" ? "flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0 flex flex-col invisible absolute inset-0"}>
        <SplitView
        storageKey="led-dictionary-v2"
        listSize={{ default: 300, min: 240, max: 440 }}
        className="h-full min-h-0"
        list={
          <ScrollArea
            className="glass-toolbar"
            toolbar={
              <div className="px-3 pb-3 pt-2 solid-pane-header">
                {/* NOTE: title/subtitle props are ignored whenever a custom
                    toolbar is passed (Glaze renders one or the other) — so the
                    heading lives here explicitly, or it never shows. */}
                <ToolbarTitle>Headwords</ToolbarTitle>
                {stats && (
                  <ToolbarDescription>
                    {`${results.length} of ${stats.totalEntries.toLocaleString()}${query ? ` for “${query}”` : ""}`}
                  </ToolbarDescription>
                )}
                <div className="mt-2">
                <SearchInput
                  value={query}
                  onChange={(v) => { setDictVisible(150); setQuery(v); }}
                  ghost={ghost}
                  onClearGhost={() => setGhost("")}
                  loading={loading}
                  inputRef={searchRef}
                />
                </div>
                {!query && (history.length > 0 || favorites.length > 0) && (
                  <div className="mt-3 space-y-2.5">
                    {history.length > 0 && (
                      <div>
                        <Text variant="small" color="tertiary" className="block mb-1">Recent</Text>
                        <div className="flex flex-wrap gap-1.5">
                          {history.slice(0, 5).map((h) => (
                            <button
                              key={`h-${h}`}
                              onClick={() => {
                                userPicked.current = true;
                                setQuery(h);
                              }}
                              className="cursor-pointer"
                            >
                              <Badge color="secondary">{h}</Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {favorites.length > 0 && (
                      <div>
                        <Text variant="small" color="tertiary" className="block mb-1">
                          Saved · {favorites.length}
                        </Text>
                        {/* Saved scales without bound: fixed-height scroll box
                            instead of an ever-taller badge pile. */}
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                          {favorites.map((f) => (
                            <button
                              key={`f-${f}`}
                              onClick={() => {
                                userPicked.current = true;
                                setQuery(f);
                              }}
                              className="cursor-pointer"
                            >
                              <Badge color="secondary">★ {f}</Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          >
            {results.length === 0 ? (
              <EmptyState
                title={query ? `No results for “${query}”` : "No headwords"}
                description="Try a different spelling or check your search."
                actions={
                  query ? (
                    <Button variant="transparent" onClick={() => setQuery("")}>
                      Clear search
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <>
              <List.Root
                items={results}
                selectedItem={selected}
                onSelectedItemChange={(item) => {
                  userPicked.current = true;
                  setSelected(item as unknown as SearchResult);
                }}
                getItemKey={(r: SearchResult) => String(r.id)}
              >
                {results.map((r) => (
                  <List.Item key={r.id} item={r as any}>
                    <List.ItemContent>
                      <List.ItemTitle className="flex items-center gap-1.5">
                        <span className="truncate">{r.hwd}</span>
                        {r.pos && (
                          <Badge size="small" color="secondary" className="shrink-0">
                            {r.pos.split(",")[0].trim()}
                          </Badge>
                        )}
                      </List.ItemTitle>
                      <List.ItemDescription className="line-clamp-2">
                        <span className="font-mono text-tertiary">/{r.pron.slice(0, 32)}/</span>
                        {r.def ? ` · ${r.def}` : ""}
                      </List.ItemDescription>
                    </List.ItemContent>
                    <List.ItemAccessory>
                      <BookOpenIcon className="size-3.5 text-quaternary" />
                    </List.ItemAccessory>
                  </List.Item>
                ))}
              </List.Root>
              {results.length >= dictVisible && (
                <div className="p-3">
                  <Button
                    variant="transparent"
                    onClick={() => setDictVisible((c) => c + 150)}
                  >
                    Show more
                  </Button>
                </div>
              )}
              </>
            )}

          </ScrollArea>
        }
      >
        <ScrollArea
          className="glass-toolbar"
          title={
            selectedEntry
              ? [
                  selectedEntry.top1000 ? "Top 1000" : "",
                  study.synonyms.length ? `${study.synonyms.length} similar word${study.synonyms.length === 1 ? "" : "s"}` : "",
                  study.phrases.length ? `${study.phrases.length} phrase${study.phrases.length === 1 ? "" : "s"}` : "",
                  study.mistakes.length ? `${study.mistakes.length} pitfall${study.mistakes.length === 1 ? "" : "s"}` : "",
                  selectedEntry.previewId ? "Illustrated" : "",
                ].filter(Boolean).join(" · ") || ""
              : "Longman Exams Dictionary"
          }
          subtitle={undefined}
          actions={undefined}
        >
          <div className="px-1 pb-6">
            <div key={selectedEntry?.hwd ?? "none"}>
              <EntryDetail
              entry={selectedEntry}
              study={study}
              streak={streak}
              showConfetti={showConfetti}
              onLookup={lookupWord}
              saved={selectedEntry ? favorites.some((f) => f.toLowerCase() === selectedEntry.hwd.toLowerCase()) : false}
              onToggleSave={() => {
                if (!selectedEntry) return;
                void (async () => {
                  try {
                    const r = await invoke<{ saved: boolean; list: string[] }>("library:favoritesToggle", {
                      hwd: selectedEntry.hwd,
                    });
                    setFavorites(r.list ?? []);
                    playBlip(SFX.save, 0.09);
                    toast.success(r.saved ? `Saved “${selectedEntry.hwd}”` : `Removed “${selectedEntry.hwd}” from saved`);
                  } catch (e) {
                    toast.error(String(e));
                  }
                })();
              }}
            />
            </div>
          </div>
          <div className="h-6" />
        </ScrollArea>
        </SplitView>
      </div>
      <div className={activeTab === "coach" ? "flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0 flex flex-col invisible absolute inset-0"}>
        <CoachView
          onLookup={lookupWord}
          onOpenGuide={(file) => {
            setGuideRequest(file);
            setActiveTab("guide");
          }}
          requestTopic={coachRequest}
          onRequestOpened={() => setCoachRequest(null)}
        />
      </div>
      <div className={activeTab === "guide" ? "flex-1 min-h-0 flex flex-col" : "flex-1 min-h-0 flex flex-col invisible absolute inset-0"}>
        <GuideView requestFile={guideRequest} onRequestOpened={() => setGuideRequest(null)} onOpenCoach={(topic) => { setCoachRequest(topic); setActiveTab("coach"); }} active={activeTab === "guide"} />
      </div>
      </div>

      <div className="app-footer h-7 shrink-0 border-t border-separator bg-panel flex items-center px-3 text-small text-tertiary gap-2">
        <GraduationCapIcon className="size-3.5" />
        <Text variant="small" color="tertiary" truncate>
          For Upper Intermediate – Advanced Learners · 212,000 words, phrases and meanings · Topic Activator / Essay Activator
        </Text>
        <div className="flex-1" />
        <Text variant="small" color="quaternary">Fully offline • Pearson 2006</Text>
      </div>
    </div>
  );
}
