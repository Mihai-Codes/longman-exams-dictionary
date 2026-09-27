import assert from "node:assert/strict";
import test from "node:test";
import { createSelectionIntent } from "../renderer/main/selection-intent.ts";

test("selection intent is scoped to its row and consumed once", () => {
  const intent = createSelectionIntent<number>();
  intent.arm(15537);

  assert.equal(intent.consume(7), false);
  assert.equal(intent.consume(15537), true);
  assert.equal(intent.consume(15537), false);
});

test("a newer pick supersedes an older pending pick", () => {
  const intent = createSelectionIntent<number>();
  intent.arm(1);
  intent.arm(2);

  assert.equal(intent.consume(1), false);
  assert.equal(intent.consume(2), true);
});

test("manual search or cancelled lookup clears pending intent", () => {
  const intent = createSelectionIntent<number>();
  intent.arm(15537);
  intent.clear();

  assert.equal(intent.consume(15537), false);
});
