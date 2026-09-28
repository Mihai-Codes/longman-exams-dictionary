import assert from "node:assert/strict";
import test from "node:test";
import { LruCache } from "../renderer/shared/lru.ts";

test("lru cache keeps the most recently used entries within its bound", () => {
  const cache = new LruCache<number>(2);
  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  assert.equal(cache.get("a"), undefined, "oldest entry is evicted");
  assert.equal(cache.get("b"), 2);
  assert.equal(cache.get("c"), 3);
});

test("a cache hit refreshes recency and survives eviction", () => {
  const cache = new LruCache<string>(2);
  cache.set("a", "old");
  cache.set("b", "mid");
  assert.equal(cache.get("a"), "old", "hit refreshes recency");
  cache.set("c", "new");

  assert.equal(cache.get("a"), "old", "refreshed entry is not evicted");
  assert.equal(cache.get("b"), undefined);
  assert.equal(cache.get("c"), "new");
});

test("re-setting a key replaces the value without growing the cache", () => {
  const cache = new LruCache<number>(1);
  cache.set("k", 1);
  cache.set("k", 2);

  assert.equal(cache.get("k"), 2);
  cache.set("other", 3);
  assert.equal(cache.get("k"), undefined);
  assert.equal(cache.get("other"), 3);
});

test("delete removes an entry and invalid maxima are rejected", () => {
  const cache = new LruCache<number>(2);
  cache.set("a", 1);
  cache.delete("a");
  assert.equal(cache.get("a"), undefined);
  cache.delete("a");
  assert.doesNotThrow(() => cache.set("b", 2));

  assert.throws(() => new LruCache<number>(0), RangeError);
  assert.throws(() => new LruCache<number>(-1), RangeError);
  assert.throws(() => new LruCache<number>(1.5), RangeError);
});
