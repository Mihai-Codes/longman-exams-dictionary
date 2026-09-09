import * as React from "react";
import { type ButtonProps } from "./button";
type SlotSize = {
    default?: number;
    min?: number;
    max?: number;
};
type SplitViewProps = {
    /** Leftmost column (typically a `<Sidebar>`). */
    sidebar?: React.ReactNode;
    sidebarSize?: SlotSize;
    /** Controlled sidebar collapse state. */
    sidebarCollapsed?: boolean;
    /** Initial collapse state when uncontrolled. Persisted alongside `storageKey`. */
    defaultSidebarCollapsed?: boolean;
    onSidebarCollapsedChange?: (collapsed: boolean) => void;
    /** Browsing/selection column between `sidebar` and the primary column. */
    list?: React.ReactNode;
    listSize?: SlotSize;
    /** Primary column (always flex). */
    children: React.ReactNode;
    primarySize?: Pick<SlotSize, "min">;
    /** Trailing metadata/preview column. Apple calls this the "inspector" (Xcode, Pages). */
    inspector?: React.ReactNode;
    inspectorSize?: SlotSize;
    inspectorCollapsed?: boolean;
    defaultInspectorCollapsed?: boolean;
    onInspectorCollapsedChange?: (collapsed: boolean) => void;
    /** Scoped key for resize + collapse persistence. Must be unique when nesting. */
    storageKey?: string;
    className?: string;
};
/**
 * Mac-style split view. Slots render left-to-right: `sidebar` → `list` → `children` → `inspector`.
 * `children` is the flex column; other slots are fixed-size and resizable.
 *
 * Sidebar and inspector support animated collapse. `<SplitView.SidebarToggle />` and
 * `<SplitView.InspectorToggle />` are pre-wired buttons; `useSplitView()` exposes the same
 * state/actions anywhere in the tree. ⌃⌘S / ⌃⌘I are wired when a matching toggle is mounted.
 *
 * Nested `SplitView`s compose: only the overall leftmost column gets the window-control
 * inset, only the overall rightmost gets the Tahoe scrollbar clearance.
 */
declare function SplitView({ sidebar, sidebarSize, sidebarCollapsed: sidebarCollapsedProp, defaultSidebarCollapsed, onSidebarCollapsedChange, list, listSize, children, primarySize, inspector, inspectorSize, inspectorCollapsed: inspectorCollapsedProp, defaultInspectorCollapsed, onInspectorCollapsedChange, storageKey, className, }: SplitViewProps): import("react/jsx-runtime").JSX.Element;
declare namespace SplitView {
    var SidebarToggle: React.ForwardRefExoticComponent<Omit<ButtonProps, "aria-label" | "aria-pressed" | "children" | "onClick"> & {
        "aria-label"?: string;
        children?: React.ReactNode;
        /**
         * Default `true`: portals the button to a fixed anchor at the SplitView frame's
         * leading / trailing edge so it stays in the same pixel position whether the panel
         * is open or collapsed (Xcode / Mail / Pages behavior).
         *
         * Pass `pinned={false}` to render the button inline at its JSX location instead —
         * useful for toggles that should sit alongside other toolbar actions. Note that a
         * non-pinned `SidebarToggle` placed inside `Sidebar.actions` disappears when the
         * sidebar collapses (the whole panel is hidden), so users can only re-open via the
         * keyboard shortcut.
         */
        pinned?: boolean;
    } & React.RefAttributes<HTMLButtonElement>>;
    var InspectorToggle: React.ForwardRefExoticComponent<Omit<ButtonProps, "aria-label" | "aria-pressed" | "children" | "onClick"> & {
        "aria-label"?: string;
        children?: React.ReactNode;
        /**
         * Default `true`: portals the button to a fixed anchor at the SplitView frame's
         * leading / trailing edge so it stays in the same pixel position whether the panel
         * is open or collapsed (Xcode / Mail / Pages behavior).
         *
         * Pass `pinned={false}` to render the button inline at its JSX location instead —
         * useful for toggles that should sit alongside other toolbar actions. Note that a
         * non-pinned `SidebarToggle` placed inside `Sidebar.actions` disappears when the
         * sidebar collapses (the whole panel is hidden), so users can only re-open via the
         * keyboard shortcut.
         */
        pinned?: boolean;
    } & React.RefAttributes<HTMLButtonElement>>;
}
export { SplitView };
export type { SplitViewProps, SlotSize };
