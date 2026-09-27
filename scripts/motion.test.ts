import assert from "node:assert/strict";
import test from "node:test";
import { motionModeFromPreference, shouldPlayMotion } from "../renderer/main/motion.ts";

test("missing or unknown preference defaults to Auto", () => {
  assert.equal(motionModeFromPreference(null), "auto");
  assert.equal(motionModeFromPreference("auto"), "auto");
  assert.equal(motionModeFromPreference("unexpected"), "auto");
});

test("preserves an explicit full-motion override", () => {
  assert.equal(motionModeFromPreference("full"), "full");
});

test("Auto follows the macOS Reduce Motion preference", () => {
  assert.equal(shouldPlayMotion("auto", true), false);
  assert.equal(shouldPlayMotion("auto", false), true);
});

test("Full mode always enables motion", () => {
  assert.equal(shouldPlayMotion("full", true), true);
  assert.equal(shouldPlayMotion("full", false), true);
});
