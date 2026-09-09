/**
 * GlobalShortcut - global shortcut API
 *
 * Registers/unregisters global keyboard shortcuts that work even when the app is not focused.
 */
/**
 * Registers a global shortcut of accelerator.
 *
 * The callback is called when the registered shortcut is pressed by the user,
 * even when the application does not have keyboard focus.
 *
 * @param accelerator - accelerator string (e.g., "CommandOrControl+X")
 * @param callback - Function to call when the shortcut is triggered
 * @returns true if the shortcut was registered successfully, false otherwise
 *
 * @example
 * ```typescript
 * const success = globalShortcut.register('CommandOrControl+X', () => {
 *   console.log('CommandOrControl+X pressed');
 * });
 *
 * if (!success) {
 *   console.log('Registration failed - shortcut may already be in use');
 * }
 * ```
 */
declare function register(accelerator: string, callback: () => void): Promise<boolean>;
/**
 * Suspends or resumes global shortcut handling.
 *
 * When suspended, registered shortcuts stop listening for key presses and new
 * shortcut registrations fail until handling is resumed.
 */
declare function setSuspended(...args: [nextSuspended: boolean]): void;
/** @deprecated Use `setSuspended()` for Electron-compatible synchronous behavior. */
declare function setSuspendedAsync(...args: [nextSuspended: boolean]): Promise<void>;
/**
 * Returns whether global shortcut handling is currently suspended.
 */
declare function isSuspended(): boolean;
/** @deprecated Use `isSuspended()` for Electron-compatible synchronous behavior. */
declare function isSuspendedAsync(): Promise<boolean>;
/**
 * Registers a global shortcut of all accelerator items in accelerators.
 *
 * @param accelerators - Array of accelerator strings
 * @param callback - Function to call when any of the shortcuts is triggered
 *
 * @example
 * ```typescript
 * globalShortcut.registerAll(['CommandOrControl+X', 'CommandOrControl+Y'], () => {
 *   console.log('Either CommandOrControl+X or CommandOrControl+Y pressed');
 * });
 * ```
 */
declare function registerAll(accelerators: string[], callback: () => void): Promise<boolean>;
/**
 * Returns whether this application has registered the accelerator.
 *
 * When the accelerator is already taken by other applications, this call
 * will still return false.
 *
 * @param accelerator - Accelerator string to check
 * @returns true if the accelerator is registered by this app
 *
 * @example
 * ```typescript
 * if (globalShortcut.isRegistered('CommandOrControl+X')) {
 *   console.log('Shortcut is registered');
 * }
 * ```
 */
declare function isRegistered(accelerator: string): boolean;
/** @deprecated Use `isRegistered()` for synchronous behavior. */
declare function isRegisteredAsync(accelerator: string): Promise<boolean>;
/**
 * Unregisters the global shortcut of accelerator.
 *
 * @param accelerator - Accelerator string to unregister
 *
 * @example
 * ```typescript
 * globalShortcut.unregister('CommandOrControl+X');
 * ```
 */
declare function unregister(accelerator: string): void;
/** @deprecated Use `unregister()` for Electron-compatible fire-and-forget behavior. */
declare function unregisterAsync(accelerator: string): Promise<void>;
/**
 * Unregisters all of the global shortcuts.
 *
 * @example
 * ```typescript
 * globalShortcut.unregisterAll();
 * ```
 */
declare function unregisterAll(): void;
/** @deprecated Use `unregisterAll()` for Electron-compatible fire-and-forget behavior. */
declare function unregisterAllAsync(): Promise<void>;
/**
 * globalShortcut module
 *
 * Accelerator format:
 * - Modifiers: Command/Cmd, Control/Ctrl, CommandOrControl/CmdOrCtrl, Alt/Option, Shift, Super/Meta
 * - Keys: A-Z, 0-9, F1-F24, Space, Tab, Backspace, Delete, Insert, Return/Enter,
 *         Up/Down/Left/Right, Home/End, PageUp/PageDown, Escape/Esc, Plus
 *
 * Examples:
 * - "CommandOrControl+X" - Cmd+X on macOS, Ctrl+X on Windows/Linux
 * - "Shift+Alt+T" - Shift+Alt+T
 * - "CommandOrControl+Shift+Z" - Cmd+Shift+Z on macOS
 */
export declare const globalShortcut: {
    register: typeof register;
    registerAll: typeof registerAll;
    isRegistered: typeof isRegistered;
    isRegisteredAsync: typeof isRegisteredAsync;
    unregister: typeof unregister;
    unregisterAsync: typeof unregisterAsync;
    unregisterAll: typeof unregisterAll;
    unregisterAllAsync: typeof unregisterAllAsync;
    setSuspended: typeof setSuspended;
    setSuspendedAsync: typeof setSuspendedAsync;
    isSuspended: typeof isSuspended;
    isSuspendedAsync: typeof isSuspendedAsync;
};
export {};
