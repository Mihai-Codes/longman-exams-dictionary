export type VerbForms = {
  simple_form?: string | null;
  past?: string | null;
  past_part?: string | null;
};

export type GroupedVerbForm = {
  label: string;
  value: string;
};

export function groupVerbForms(verb: VerbForms): GroupedVerbForm[] {
  const forms = [
    { label: "Base", value: verb.simple_form },
    { label: "Past", value: verb.past },
    { label: "Past participle", value: verb.past_part },
  ];
  const grouped = new Map<string, GroupedVerbForm>();

  for (const { label, value } of forms) {
    const normalized = value?.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    const existing = grouped.get(key);
    if (existing) existing.label += ` / ${label}`;
    else grouped.set(key, { label, value: normalized });
  }

  return [...grouped.values()];
}
