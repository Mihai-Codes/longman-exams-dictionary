import * as path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { appHandlers } from "./app.js";
import { dictionaryHandlers } from "./dictionary.js";
import { libraryHandlers } from "./library.js";
import { getSettingsWindow, openSettingsWindow } from "../windows/settings-window.js";
import { ipcMain, logger } from "@glaze/core/backend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerHandlers(): void {
  logger.info("handlers", "Registering IPC handlers...");

  ipcMain.handle("app:getInfo", async () => {
    return await appHandlers.getInfo();
  });

  ipcMain.handle("app:getProjectPath", async () => {
    return path.join(__dirname, "..", "..");
  });

  ipcMain.handle("window:openSettings", async () => {
    await openSettingsWindow();
  });

  ipcMain.handle("window:closeSettings", async () => {
    getSettingsWindow()?.close();
  });

  // Dictionary handlers — native replacement for LED Windows app
  ipcMain.handle("dictionary:search", async (_e, p: { query: string; limit?: number }) => {
    return dictionaryHandlers.search(p);
  });
  ipcMain.handle("dictionary:getEntry", async (_e, p: { id?: number; hwd?: string }) => {
    // normalize: frontend may send {id} or {hwd}
    if (typeof (p as any).id === "number") return dictionaryHandlers.getEntry({ id: (p as any).id });
    if ((p as any).hwd) return dictionaryHandlers.getEntry({ hwd: (p as any).hwd });
    return dictionaryHandlers.getEntry(p as any);
  });
  ipcMain.handle("dictionary:stats", async () => dictionaryHandlers.stats());
  ipcMain.handle("dictionary:image", async (_e, p: { id: string }) => dictionaryHandlers.image(p));
  ipcMain.handle("dictionary:audio", async (_e, p: { hwd: string }) => dictionaryHandlers.audio(p));
  ipcMain.handle("dictionary:helpList", async () => dictionaryHandlers.helpList());
  ipcMain.handle("dictionary:helpPage", async (_e, p: { file: string }) => dictionaryHandlers.helpPage(p));
  ipcMain.handle("dictionary:thesaurus", async (_e, p: { hwd: string }) => dictionaryHandlers.thesaurus(p));
  ipcMain.handle("dictionary:phrases", async (_e, p: { hwd: string }) => dictionaryHandlers.phrases(p));
  ipcMain.handle("dictionary:corpus", async (_e, p: { hwd: string }) => dictionaryHandlers.corpus(p));
  ipcMain.handle("dictionary:verb", async (_e, p: { hwd: string }) => dictionaryHandlers.verb(p));
  ipcMain.handle("dictionary:errors", async (_e, p: { hwd: string }) => dictionaryHandlers.errors(p));
  ipcMain.handle("dictionary:topics", async (_e, p: { query: string; limit?: number }) => dictionaryHandlers.topics(p));

  // Personal library — recent lookups + saved words in app userData
  ipcMain.handle("library:history", async () => libraryHandlers.history());
  ipcMain.handle("library:historyPush", async (_e, p: { hwd: string }) => libraryHandlers.historyPush(p));
  ipcMain.handle("library:historyClear", async () => libraryHandlers.historyClear());
  ipcMain.handle("library:favorites", async () => libraryHandlers.favorites());
  ipcMain.handle("library:favoritesToggle", async (_e, p: { hwd: string }) => libraryHandlers.favoritesToggle(p));

  // Opt-in bridge to the current online dictionary. Host is fixed in the
  // template — only the headword slug varies, so this channel can never be
  // aimed at an arbitrary URL (phishing-safe by construction).
  ipcMain.handle("shell:openOnline", async (_e, p: { hwd: string }) => {
    const slug = (p?.hwd || "").toLowerCase().trim().replace(/\s+/g, "-");
    if (!slug || !/^[a-z0-9'’%.-]+(?:-[a-z0-9'’%.-]+)*$/.test(slug)) throw new Error("bad headword");
    const url = `https://www.ldoceonline.com/dictionary/${encodeURIComponent(slug)}`;
    await new Promise<void>((resolve, reject) => {
      execFile("/usr/bin/open", [url], (e) => (e ? reject(e) : resolve()));
    });
    return true;
  });

  logger.info("handlers", "✓ IPC handlers registered (app + dictionary)");
}
