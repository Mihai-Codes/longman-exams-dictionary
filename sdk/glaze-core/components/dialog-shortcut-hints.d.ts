import * as React from "react";
/**
 * Inline ⌘↵ rendered next to the confirm label. Shows ONLY when the dialog body has a text input
 * and the shortcut is therefore Cmd/Ctrl+Enter — that case is unusual enough that the affordance
 * needs to be visible at rest. The plain-Enter case uses a tooltip wrapper instead so the button
 * stays clean.
 */
declare function ConfirmKeyHint(): import("react/jsx-runtime").JSX.Element | null;
/**
 * Wraps a confirm button in a tooltip showing the ↵ shortcut, only in plain-Enter mode. In
 * Cmd+Enter mode the shortcut renders inline via `<ConfirmKeyHint />` instead, and this wrapper
 * is a no-op pass-through.
 */
declare function ConfirmShortcutTooltip({ children }: {
    children: React.ReactElement;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Wraps a cancel button in a tooltip showing the Esc shortcut. Always tooltip — Esc-to-close is
 * the same affordance regardless of confirm-shortcut mode, so there's no reason to render it
 * inline.
 */
declare function CancelShortcutTooltip({ children }: {
    children: React.ReactElement;
}): import("react/jsx-runtime").JSX.Element;
export { CancelShortcutTooltip, ConfirmKeyHint, ConfirmShortcutTooltip };
