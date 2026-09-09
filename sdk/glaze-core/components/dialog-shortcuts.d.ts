import * as React from "react";
type DialogShortcutMode = "enter" | "cmd-enter";
type DialogShortcutContextValue = {
    mode: DialogShortcutMode;
    registerConfirm: (el: HTMLButtonElement | null) => void;
};
declare const DialogShortcutContext: React.Context<DialogShortcutContextValue | null>;
declare function detectShortcutMode(root: Pick<HTMLElement, "querySelector"> | null): DialogShortcutMode;
/**
 * Wires up keyboard shortcuts for a dialog's confirm action. Detects whether the body has a text
 * input and picks the shortcut accordingly: plain Enter when there's nothing to type into, Cmd/
 * Ctrl+Enter when the user is meant to type first. Esc is left to Radix.
 *
 * The shortcut is dialog-scoped, not focus-scoped — Enter fires confirm even when Cancel is
 * focused. This matches macOS native dialogs (default button responds to Enter regardless of
 * focus) and keeps the visible hint authoritative.
 */
declare function useDialogShortcuts(): {
    contextValue: DialogShortcutContextValue;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
    contentRef: (node: HTMLElement | null) => void;
};
declare function useRegisterConfirm(ref: React.RefObject<HTMLButtonElement | null>): void;
export { DialogShortcutContext, type DialogShortcutMode, detectShortcutMode as detectShortcutModeForTesting, useDialogShortcuts, useRegisterConfirm, };
