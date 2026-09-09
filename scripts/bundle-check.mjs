// Bundle-ability proof without the Glaze desktop app: esbuild resolves and
// transforms every local + npm import in both processes. @glaze/* stays
// external (the real SDK links it at package time), so this validates OUR
// code bundles — the exact class that broke at 1262:15 before.
import { build } from "esbuild";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const shared = {
  bundle: true,
  write: false,
  logLevel: "error",
  // @glaze/* links at package time; ./dev/* are template-only harnesses
  // excluded from scaffolded apps (env-guarded dynamic imports).
  external: ["@glaze/*", "./dev/*"],
  loader: { ".css": "css" },
  jsx: "automatic",
};

await build({ ...shared, platform: "node", format: "esm", entryPoints: ["main/index.ts"] });
console.log("ok  backend bundles");
// The stylesheet import needs a real output path; bundle into a temp dir
// and discard it — resolution + transform is what is being proven.
const outdir = mkdtempSync(join(tmpdir(), "led-bundle-check-"));
await build({ ...shared, write: true, outdir, platform: "browser", entryPoints: ["renderer/main/index.tsx"] });
rmSync(outdir, { recursive: true, force: true });
console.log("ok  renderer bundles");
console.log("\nbundle-ability holds");
