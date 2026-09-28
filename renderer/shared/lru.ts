// Small bounded LRU used by both processes for read-only memoization.
// Map preserves insertion order, so that order is the recency list:
// hits re-insert (making themselves newest), overflow evicts the oldest.
export class LruCache<T> {
  private readonly entries = new Map<string, T>();

  constructor(private readonly maximum: number) {
    if (!Number.isSafeInteger(maximum) || maximum <= 0) {
      throw new RangeError(`LruCache maximum must be a positive integer, got ${maximum}`);
    }
  }

  get(key: string): T | undefined {
    const hit = this.entries.get(key);
    if (hit === undefined) return undefined;
    this.entries.delete(key);
    this.entries.set(key, hit);
    return hit;
  }

  set(key: string, value: T): void {
    if (this.entries.has(key)) this.entries.delete(key);
    this.entries.set(key, value);
    while (this.entries.size > this.maximum) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }

  delete(key: string): void {
    this.entries.delete(key);
  }
}
