/**
 * Dialog - dialog API
 *
 * Provides helpers for file dialogs, message boxes, and error boxes.
 */
import { BrowserWindow } from "./browser-window.js";
import { type Certificate } from "./session.js";
import { type OpenDialogOptions, type OpenDialogResult, type SaveDialogOptions, type SaveDialogResult, type MessageBoxOptions, type MessageBoxResult, type DatePickerOptions, type DatePickerResult } from "../ipc/native-api.js";
export interface CertificateTrustDialogOptions {
    certificate: Certificate;
    message?: string;
}
export type { DatePickerOptions, DatePickerResult, FileFilter, MessageBoxIcon, MessageBoxOptions, MessageBoxResult, OpenDialogOptions, OpenDialogResult, SaveDialogOptions, SaveDialogResult, } from "../ipc/native-api.js";
/**
 * Show a native open file/folder dialog
 *
 * @param options - Dialog options
 * @returns Promise resolving to { canceled: boolean, filePaths: string[] }
 *
 * @example
 * ```typescript
 * const result = await dialog.showOpenDialog({
 *   title: 'Select a file',
 *   defaultPath: '/path/to/default',
 *   filters: [
 *     { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
 *     { name: 'All Files', extensions: ['*'] }
 *   ],
 *   properties: ['openFile', 'multiSelections']
 * });
 *
 * if (!result.canceled) {
 *   console.log('Selected files:', result.filePaths);
 * }
 * ```
 */
declare function showOpenDialog(options?: OpenDialogOptions): Promise<OpenDialogResult>;
declare function showOpenDialog(window: BrowserWindow, options?: OpenDialogOptions): Promise<OpenDialogResult>;
/**
 * Show a native save file dialog
 *
 * @param options - Dialog options
 * @returns Promise resolving to { canceled: boolean, filePath?: string }
 *
 * @example
 * ```typescript
 * const result = await dialog.showSaveDialog({
 *   title: 'Save file',
 *   defaultPath: '/path/to/default/filename.txt',
 *   filters: [
 *     { name: 'Text Files', extensions: ['txt'] },
 *     { name: 'All Files', extensions: ['*'] }
 *   ]
 * });
 *
 * if (!result.canceled && result.filePath) {
 *   console.log('Save to:', result.filePath);
 * }
 * ```
 */
declare function showSaveDialog(options?: SaveDialogOptions): Promise<SaveDialogResult>;
declare function showSaveDialog(window: BrowserWindow, options?: SaveDialogOptions): Promise<SaveDialogResult>;
/**
 * Show a native message box dialog
 *
 * @param options - Dialog options
 * @returns Promise resolving to { response: number, checkboxChecked: boolean }
 *
 * @example
 * ```typescript
 * const result = await dialog.showMessageBox({
 *   type: 'question',
 *   title: 'Confirm',
 *   message: 'Are you sure you want to proceed?',
 *   detail: 'This action cannot be undone.',
 *   buttons: ['Cancel', 'OK'],
 *   defaultId: 1,
 * });
 *
 * if (result.response === 1) {
 *   console.log('User clicked OK');
 * }
 * ```
 */
declare function showMessageBox(options: MessageBoxOptions): Promise<MessageBoxResult>;
declare function showMessageBox(window: BrowserWindow, options: MessageBoxOptions): Promise<MessageBoxResult>;
/**
 * Show an error box dialog
 *
 * @param title - The title of the error box
 * @param content - The content/message of the error box
 *
 * @example
 * ```typescript
 * dialog.showErrorBox('Error', 'Something went wrong!');
 * ```
 */
declare function showErrorBox(title: string, content: string): void;
/** @deprecated Use `showErrorBox()` for Electron-compatible fire-and-forget behavior. */
declare function showErrorBoxAsync(title: string, content: string): Promise<void>;
/**
 * Show the platform certificate trust dialog.
 */
declare function showCertificateTrustDialog(options: CertificateTrustDialogOptions): Promise<void>;
declare function showCertificateTrustDialog(window: BrowserWindow, options: CertificateTrustDialogOptions): Promise<void>;
/**
 * Show a native date picker popover
 */
declare function showDatePicker(options: DatePickerOptions): Promise<DatePickerResult>;
/**
 * dialog module
 */
export declare const dialog: {
    showOpenDialog: typeof showOpenDialog;
    showSaveDialog: typeof showSaveDialog;
    showMessageBox: typeof showMessageBox;
    showErrorBox: typeof showErrorBox;
    showErrorBoxAsync: typeof showErrorBoxAsync;
    showCertificateTrustDialog: typeof showCertificateTrustDialog;
    showDatePicker: typeof showDatePicker;
};
