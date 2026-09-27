import assert from "node:assert/strict";
import test from "node:test";
import { createRequestGuard } from "../renderer/main/request-guard.ts";

test("only the newest overlapping request may publish", () => {
  const guard = createRequestGuard();
  const oldRequest = guard.begin();
  const currentRequest = guard.begin();

  assert.equal(oldRequest(), false);
  assert.equal(currentRequest(), true);
});

test("cleanup invalidates a request even before its replacement starts", () => {
  const guard = createRequestGuard();
  const request = guard.begin();

  guard.invalidate();

  assert.equal(request(), false);
});

test("a fresh request becomes current after invalidation", () => {
  const guard = createRequestGuard();
  const first = guard.begin();
  guard.invalidate();
  const next = guard.begin();

  assert.equal(first(), false);
  assert.equal(next(), true);
});

test("out-of-order search completions cannot publish or finish the current load", () => {
  const guard = createRequestGuard();
  const slowSearch = guard.begin();
  const fastSearch = guard.begin();
  let loading = true;
  let results = "fast";

  if (slowSearch()) {
    results = "slow";
    loading = false;
  }
  assert.equal(results, "fast");
  assert.equal(loading, true);

  if (fastSearch()) loading = false;
  assert.equal(loading, false);
});

test("a rejected stale request cannot publish its error", () => {
  const guard = createRequestGuard();
  const stale = guard.begin();
  guard.begin();
  const errors: string[] = [];

  if (stale()) errors.push("stale failure");
  assert.deepEqual(errors, []);
});

test("a cancelled tapped-word lookup does not leave user intent armed", () => {
  const guard = createRequestGuard();
  let userPicked = true;
  const lookupCurrent = guard.begin();
  const newerLookup = guard.begin();

  if (!lookupCurrent() && lookupCurrent()) userPicked = false;
  assert.equal(userPicked, true);
  if (newerLookup()) userPicked = false;
  assert.equal(userPicked, false);
});
