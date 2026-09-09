import * as React from "react";
/**
 * Context provided by `<Sidebar>`. Presence (non-null value) signals "we're inside a Sidebar" —
 * `Toolbar` and other components use that to tweak styling (e.g. window-control inset logic).
 *
 * The value also carries a sidebar-wide collapsible registry: `SidebarListItem`s with
 * `collapsible=true` register into it, and `SidebarList` OR's `hasCollapsibleItems` with its
 * own local detection so leaf-item icons line up in one vertical column across *all* groups.
 */
export interface SidebarContextValue {
    registerCollapsible: () => () => void;
    hasCollapsibleItems: boolean;
}
declare const SidebarContext: React.Context<SidebarContextValue | null>;
/** Returns `true` when rendered inside a `<Sidebar>`. */
export declare function useSidebarContext(): boolean;
export { SidebarContext };
