import assert from "node:assert/strict";
import test from "node:test";
import { awardLookup, type GamificationProgress } from "../renderer/main/gamification.ts";

const today = "Sun Sep 27 2026";
const fresh = (): GamificationProgress => ({ count: 1, lastDate: today, xp: 0, level: 1, seen: [] });

test("first-time lookup earns XP and a same-day repeat does not", () => {
  const first = awardLookup(fresh(), " Gobsmacked ", today);
  assert.equal(first?.progress.xp, 1);
  assert.equal(first?.cue, "xp");
  assert.equal(awardLookup(first!.progress, "gobsmacked", today), null);
});

test("first lookup on a consecutive day plays a streak cue", () => {
  const previous = { ...fresh(), lastDate: "Sat Sep 26 2026", count: 4, seen: ["known"] };
  const result = awardLookup(previous, "new word", today);
  assert.equal(result?.progress.count, 5);
  assert.equal(result?.cue, "streak");
});

test("10th unique word earns milestone bonus and achievement cue", () => {
  const previous = { ...fresh(), xp: 9, seen: Array.from({ length: 9 }, (_, i) => `word-${i}`) };
  const result = awardLookup(previous, "word-9", today);
  assert.equal(result?.bonus, 10);
  assert.equal(result?.progress.xp, 20);
  assert.equal(result?.cue, "achievement");
});

test("level-up on an ordinary new word uses achievement cue", () => {
  const previous = { ...fresh(), xp: 49 };
  const result = awardLookup(previous, "new word", today);
  assert.equal(result?.progress.level, 2);
  assert.equal(result?.cue, "achievement");
});

test("blank lookups and revisits never produce a reward cue", () => {
  const previous = { ...fresh(), seen: ["known"] };
  assert.equal(awardLookup(previous, "  ", today), null);
  assert.equal(awardLookup(previous, "KNOWN", today), null);
});
