/**
 * Shell - shell API
 *
 * Provides helpers for opening files, revealing paths, trashing items, and
 * triggering simple shell actions.
 */
export interface ShellOpenExternalOptions {
    /**
     * Bring the opened application to the foreground. macOS defaults to true.
     */
    activate?: boolean;
    /**
     * Windows-only Electron option. Accepted for API shape but ignored on macOS.
     */
    workingDirectory?: string;
    /**
     * Windows-only Electron option. Accepted for API shape but ignored on macOS.
     */
    logUsage?: boolean;
}
/**
 * Open a file with its default application
 *
 * @param path - The path to the file to open
 * @returns Promise resolving to empty string on success, or error message on failure
 *
 * @example
 * ```typescript
 * const error = await shell.openPath('/path/to/document.pdf');
 * if (error) {
 *   console.error('Failed to open:', error);
 * }
 * ```
 */
declare function openPath(_path: string): Promise<string>;
/**
 * Open an external URL in the default browser
 *
 * @param url - The URL to open
 *
 * @example
 * ```typescript
 * await shell.openExternal('https://example.com');
 * ```
 */
declare function openExternal(_url: string, _options?: ShellOpenExternalOptions): Promise<void>;
/** @deprecated Use `openExternal()` for Electron-compatible `Promise<void>` behavior. */
declare function openExternalWithResult(_url: string, _options?: ShellOpenExternalOptions): Promise<boolean>;
/**
 * Show a file in its containing folder (Finder on macOS)
 *
 * @param path - The path to the file to reveal
 *
 * @example
 * ```typescript
 * shell.showItemInFolder('/path/to/file.txt');
 * ```
 */
declare function showItemInFolder(_path: string): void;
/** @deprecated Use `showItemInFolder()` for Electron-compatible fire-and-forget behavior. */
declare function showItemInFolderAsync(_path: string): Promise<boolean>;
/**
 * Move a file to the system trash
 *
 * @param path - The path to the file to trash
 * @returns Promise that resolves when complete
 *
 * @example
 * ```typescript
 * await shell.trashItem('/path/to/file.txt');
 * ```
 */
declare function trashItem(_path: string): Promise<void>;
/**
 * Play the system beep sound
 *
 * @example
 * ```typescript
 * shell.beep();
 * ```
 */
declare function beep(): void;
/** @deprecated Use `beep()` for Electron-compatible fire-and-forget behavior. */
declare function beepAsync(): Promise<void>;
/**
 * shell module
 */
export declare const shell: {
    openPath: typeof openPath;
    openExternal: typeof openExternal;
    openExternalWithResult: typeof openExternalWithResult;
    showItemInFolder: typeof showItemInFolder;
    showItemInFolderAsync: typeof showItemInFolderAsync;
    trashItem: typeof trashItem;
    beep: typeof beep;
    beepAsync: typeof beepAsync;
};
export {};
