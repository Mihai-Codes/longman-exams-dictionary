import * as React from "react";
type ButtonDefaults = {
    variant?: string;
    size?: string;
    className?: string;
};
/**
 * Fill in `variant` / `size` / `className` on Button children, descending through wrappers like
 * Tooltip or `DropdownMenuTrigger asChild`. Explicit props on the Button win.
 *
 * Does not traverse function-as-children (`<Menu>{(state) => <Button />}</Menu>`) — set props
 * manually in that case.
 */
declare function applyButtonDefaults(node: React.ReactNode, defaults: ButtonDefaults): React.ReactNode;
/** Content-area defaults (`variant="glass"`, `size="large"`). Icon sizing is the caller's. */
declare function applyContentToolbarButtonDefaults(actions: React.ReactNode): React.ReactNode;
export { applyButtonDefaults, applyContentToolbarButtonDefaults };
export type { ButtonDefaults };
