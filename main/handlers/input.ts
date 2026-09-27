export function boundedInteger(value: unknown, fallback: number, maximum: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(Math.max(Math.floor(value), 0), maximum);
}

export function cleanString(value: unknown): string {
  return typeof value === "string" && value.length <= 256 ? value.trim() : "";
}

export function normalizedString(value: unknown): string {
  return cleanString(value).toLowerCase();
}

export function normalizedQuery(value: unknown): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > 256) return null;
  return value.trim().toLowerCase();
}

export function normalizedStrings(values: unknown, maximum: number): string[] {
  const cap = Number.isSafeInteger(maximum) ? Math.min(Math.max(maximum, 0), 300) : 0;
  if (!Array.isArray(values) || cap === 0) return [];
  const out = new Set<string>();
  const scanLimit = Math.min(values.length, 300);
  for (let i = 0; i < scanLimit && out.size < cap; i += 1) {
    const value = normalizedString(values[i]);
    if (value && value.length <= 256) out.add(value);
  }
  return [...out];
}

export function onlineDictionarySlug(value: unknown): string {
  const slug = normalizedString(value).replace(/\s+/g, "-");
  return slug.length <= 128 && slug !== "." && slug !== ".." && /^[a-z0-9'’%.-]+(?:-[a-z0-9'’%.-]+)*$/.test(slug)
    ? slug
    : "";
}
