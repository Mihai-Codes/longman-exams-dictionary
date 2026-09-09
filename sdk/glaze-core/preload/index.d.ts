/**
 * Glaze Framework - Preload Script APIs
 *
 * This module provides APIs that should ONLY be used in preload scripts.
 * These APIs have privileged access to IPC and native functionality.
 *
 * SECURITY WARNING:
 * - Do NOT import this module in renderer code
 * - Do NOT expose ipcRenderer directly to renderer via contextBridge
 * - Only expose specific, validated API methods
 *
 * Usage in preload script:
 * ```typescript
 * import { ipcRenderer, contextBridge } from '@glaze/core/preload';
 *
 * // Expose only specific APIs to the renderer
 * contextBridge.exposeInMainWorld('myAppAPI', {
 *   // Good: Expose specific, controlled methods
 *   getVersion: () => ipcRenderer.invoke('app:getVersion'),
 *   saveFile: (name: string, data: string) => {
 *     // Validate inputs before passing to IPC
 *     if (!name || typeof name !== 'string') throw new Error('Invalid name');
 *     return ipcRenderer.invoke('fs:save', { name, data });
 *   },
 *
 *   // BAD - Never do this:
 *   // ipcRenderer: ipcRenderer, // NEVER expose ipcRenderer directly!
 * });
 * ```
 *
 * In renderer (app code), only the exposed API is available:
 * ```typescript
 * // Renderer can only access what was explicitly exposed
 * const version = await window.myAppAPI.getVersion();
 * await window.myAppAPI.saveFile('test.txt', 'hello');
 *
 * // These would fail - ipcRenderer is not accessible:
 * // window.myAppAPI.ipcRenderer.invoke(...) // undefined
 * // import { ipcRenderer } from '@glaze/core/preload' // should not be bundled
 * ```
 *
 * BUILD CONSTRAINTS:
 * The preload is built as a self-contained IIFE (Immediately Invoked Function
 * Expression) because WKWebView injects it via WKUserScript, which only accepts
 * classic scripts — not ES modules. The build system (esbuild) handles this
 * transparently: developers write normal TypeScript with imports, and everything
 * is bundled into a single file. This means:
 * - No dynamic import() at runtime (all deps resolved at build time)
 * - No top-level await (classic scripts don't support it)
 * - No Node.js APIs (fs, path, etc.) — WKWebView is a pure browser environment
 * - Keep preloads thin — all code is inlined into one injected script
 *
 * ISOLATION MODEL:
 * Glaze's WKContentWorld isolation gives each world its own globals,
 * prototypes, and DOM bindings, so prototype pollution in the page world
 * cannot affect the preload world.
 */
export { ipcRenderer } from "../ipc/ipc-renderer.js";
export type { IpcRendererEvent, IpcRendererListener } from "../ipc/ipc-renderer.js";
export { contextBridge } from "../ipc/context-bridge.js";
export type { ExecutionScript, ExposeInIsolatedWorld, ExposeInMainWorld } from "../ipc/context-bridge.js";
export { createNativeImageAPI } from "./native-image.js";
export type { NativeImage, NativeImageAPI, NativeImageAddRepresentationOptions, NativeImageCreateFromBitmapOptions, NativeImageCreateFromBufferOptions, NativeImageResizeOptions, NativeImageToBitmapOptions, NativeImageToDataURLOptions, NativeImageToPNGOptions, NativeImageInvoke, Rectangle as NativeImageRectangle, Size as NativeImageSize, } from "./native-image.js";
export { createLocationGetCurrentPosition } from "./location.js";
export type { GetCurrentPositionCompat } from "./location.js";
export { createWebUtilsAPI } from "./web-utils.js";
export type { WebUtilsAPI } from "./web-utils.js";
export { installDisplayMediaCompat } from "./display-media.js";
export { createClipboardAPI } from "./clipboard.js";
export type { ClipboardAPI, ClipboardBinaryValue, ClipboardBookmark, ClipboardBuffer, ClipboardChangeOptions, ClipboardCustomValue, ClipboardImage, ClipboardImageWriteOptions, ClipboardItemInfo, ClipboardLegacyArrayBuffer, ClipboardPasteboardType, ClipboardWriteData, } from "./clipboard.js";
