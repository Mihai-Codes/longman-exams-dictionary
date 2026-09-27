import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { groupVerbForms, type VerbForms } from "../renderer/main/verb-forms.ts";

test("renders the actual corpus paradigm for sex without duplicate forms", () => {
  const db = new DatabaseSync("data/led_full.sqlite", { readOnly: true });
  try {
    const verb = db.prepare("SELECT simple_form, past, past_part FROM verb WHERE hwd_lower = ? LIMIT 1").get("sex") as VerbForms | undefined;
    assert.ok(verb);
    assert.deepEqual(groupVerbForms(verb), [
      { label: "Base", value: "sex" },
      { label: "Past / Past participle", value: "sexed" },
    ]);
  } finally {
    db.close();
  }
});

test("groups identical past and past participle forms", () => {
  assert.deepEqual(groupVerbForms({ simple_form: "sex", past: "sexed", past_part: "sexed" }), [
    { label: "Base", value: "sex" },
    { label: "Past / Past participle", value: "sexed" },
  ]);
});

test("keeps distinct irregular forms separately labeled", () => {
  assert.deepEqual(groupVerbForms({ simple_form: "write", past: "wrote", past_part: "written" }), [
    { label: "Base", value: "write" },
    { label: "Past", value: "wrote" },
    { label: "Past participle", value: "written" },
  ]);
});

test("groups case-insensitive duplicates and preserves the first display form", () => {
  assert.deepEqual(groupVerbForms({ simple_form: "Read", past: "read", past_part: "READ" }), [
    { label: "Base / Past / Past participle", value: "Read" },
  ]);
});

test("omits missing and whitespace-only forms", () => {
  assert.deepEqual(groupVerbForms({ simple_form: "go", past: " ", past_part: null }), [
    { label: "Base", value: "go" },
  ]);
  assert.deepEqual(groupVerbForms({}), []);
});
