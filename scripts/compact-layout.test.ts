import assert from "node:assert/strict";
import test from "node:test";
import { COMPACT_LAYOUT_MAX_WIDTH, isCompactLayout } from "../renderer/main/compact-layout.ts";

test("compact layout switches at the supported pane-width boundary", () => {
  assert.equal(isCompactLayout(COMPACT_LAYOUT_MAX_WIDTH - 1), true);
  assert.equal(isCompactLayout(COMPACT_LAYOUT_MAX_WIDTH), true);
  assert.equal(isCompactLayout(COMPACT_LAYOUT_MAX_WIDTH + 1), false);
});

test("compact layout rejects invalid or non-positive widths", () => {
  assert.equal(isCompactLayout(Number.NaN), false);
  assert.equal(isCompactLayout(Number.POSITIVE_INFINITY), false);
  assert.equal(isCompactLayout(0), false);
  assert.equal(isCompactLayout(-1), false);
});
