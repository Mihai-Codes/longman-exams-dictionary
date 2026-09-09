/**
 * Glaze Backend Runtime Bootstrap
 *
 * This module is loaded via --import before the app's main/index.ts.
 * It creates and wires the IPC server, native bridge, protocol handlers,
 * lifecycle management, and signal handlers.
 *
 * After this module completes, app code can use * APIs (app, ipcMain, BrowserWindow, etc.) without manual wiring.
 *
 * @internal Not part of the public API — loaded by the glaze CLI only.
 */
import "./swift-sidecar-dev-runtime.js";
