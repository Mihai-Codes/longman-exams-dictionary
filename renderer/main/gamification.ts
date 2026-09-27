export type GamificationProgress = {
  count: number;
  lastDate: string;
  xp: number;
  level: number;
  seen: string[];
};

export type GamificationCue = "xp" | "streak" | "achievement";

export function awardLookup(
  previous: GamificationProgress,
  hwd: string,
  today = new Date().toDateString(),
): { progress: GamificationProgress; cue: GamificationCue; bonus: number } | null {
  const key = hwd.trim().toLowerCase();
  if (!key || previous.seen.includes(key)) return null;

  const seen = [...previous.seen, key].slice(-5000);
  const bonus = seen.length === 10 || seen.length === 50 || seen.length === 100 ? 10 : 0;
  const xp = previous.xp + 1 + bonus;
  const level = Math.floor(xp / 50) + 1;
  const gap = Math.round((new Date(today).getTime() - new Date(previous.lastDate).getTime()) / 86400000);
  const progress = {
    count: previous.lastDate !== today ? (gap === 1 ? previous.count + 1 : 1) : previous.count,
    lastDate: today,
    xp,
    level,
    seen,
  };
  const cue: GamificationCue = bonus > 0 || level > previous.level
    ? "achievement"
    : previous.lastDate !== today
      ? "streak"
      : "xp";

  return { progress, cue, bonus };
}
