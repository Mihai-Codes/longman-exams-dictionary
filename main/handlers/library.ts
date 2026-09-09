import * as fs from "node:fs";
import * as path from "node:path";
import { app, logger } from "@glaze/core/backend";

// Personal library: recent lookups + saved words, persisted under the OS
// app-data dir (never in the repo). JSON + atomic rename is plenty at this
// scale — no DB needed for two small lists.
const MAX_HISTORY = 60;

function file(name: string): string {
  return path.join(app.getPath("userData"), name);
}

function load(name: string): string[] {
  try {
    const raw = fs.readFileSync(file(name), "utf-8");
    const arr = JSON.parse(raw) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function save(name: string, list: string[]): void {
  try {
    const tmp = `${file(name)}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(list), "utf-8");
    fs.renameSync(tmp, file(name));
  } catch (e) {
    logger.error("library", `save ${name} failed: ${String(e)}`);
  }
}

export const libraryHandlers = {
  history: async (): Promise<string[]> => load("led-history.json"),

  historyPush: async (params: { hwd: string }): Promise<string[]> => {
    const hwd = (params.hwd || "").trim();
    if (!hwd) return load("led-history.json");
    const list = [hwd, ...load("led-history.json").filter((x) => x.toLowerCase() !== hwd.toLowerCase())].slice(
      0,
      MAX_HISTORY,
    );
    save("led-history.json", list);
    return list;
  },

  historyClear: async (): Promise<string[]> => {
    save("led-history.json", []);
    return [];
  },

  favorites: async (): Promise<string[]> => load("led-favorites.json"),

  favoritesToggle: async (params: { hwd: string }): Promise<{ saved: boolean; list: string[] }> => {
    const hwd = (params.hwd || "").trim();
    const list = load("led-favorites.json");
    const idx = list.findIndex((x) => x.toLowerCase() === hwd.toLowerCase());
    const saved = idx < 0;
    if (saved && hwd) list.unshift(hwd);
    else if (!saved) list.splice(idx, 1);
    save("led-favorites.json", list);
    return { saved, list };
  },
};
