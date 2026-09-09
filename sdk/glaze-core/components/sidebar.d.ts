import * as React from "react";
import { Toolbar } from "./toolbar";
import { type TextProps } from "./text";
interface SidebarProps {
    children: React.ReactNode;
    className?: string;
    /** Escape hatch: pass a fully custom Toolbar. Overrides actions/searchable props. */
    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    scrollEnabled?: boolean;
    /** Action buttons for the sidebar toolbar. Auto-styled with variant="transparent" size="small". */
    actions?: React.ReactNode;
    /** Adds a ToolbarSearchInput row to the sidebar toolbar. */
    searchable?: boolean;
    /** Placeholder text for the search input. Defaults to "Search". */
    searchPlaceholder?: string;
    /** Controlled search value. Omit for uncontrolled mode. */
    searchValue?: string;
    /** Callback when search value changes (controlled mode). */
    onSearchChange?: (value: string) => void;
}
export declare function Sidebar({ children, className, toolbar, footer, scrollEnabled, actions, searchable, searchPlaceholder, searchValue, onSearchChange, }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Sidebar {
    var displayName: string;
}
interface SidebarListProps<T = unknown> {
    children: React.ReactNode;
    className?: string;
    /** Array of items for managed selection. Used with getItemKey and onSelectedItemChange. */
    items?: T[];
    /** Currently selected item. */
    selectedItem?: T | null;
    /** Callback when selection changes. */
    onSelectedItemChange?: (item: T) => void;
    /** Key extractor for items. Required when items is provided. */
    getItemKey?: (item: T) => string;
    /** Shown when items array is empty. */
    emptyState?: React.ReactNode;
}
export declare function SidebarList<T>({ children, className, items, selectedItem, onSelectedItemChange, getItemKey, emptyState, }: SidebarListProps<T>): import("react/jsx-runtime").JSX.Element;
interface SidebarListGroupProps {
    children?: React.ReactNode;
    className?: string;
    /** Section label. When set (in collapsible mode), renders the muted header automatically. */
    title?: React.ReactNode;
    /**
     * Trailing action slot. Button children are auto-styled with `variant="transparent"` (same
     * pattern as Sidebar.actions). When `collapsible`, actions + chevron reveal together on hover.
     */
    actions?: React.ReactNode;
    /** Wrap the group in a Collapsible with an Apple Mail-style header (chevron + hover-revealed actions). */
    collapsible?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Force the group open regardless of user state — e.g. during search. User state is preserved. */
    forceOpen?: boolean;
}
export declare function SidebarListGroup({ children, className, title, actions, collapsible, defaultOpen, open, onOpenChange, forceOpen, }: SidebarListGroupProps): import("react/jsx-runtime").JSX.Element;
interface SidebarListGroupTitleProps {
    children: React.ReactNode;
    /**
     * Render the title's styling on a child element instead of the default `<h2>`. Useful for making
     * the title clickable by composing with `CollapsibleTrigger` — e.g. a collapsible section header.
     */
    asChild?: boolean;
    className?: string;
}
export declare function SidebarListGroupTitle({ children, asChild, className }: SidebarListGroupTitleProps): import("react/jsx-runtime").JSX.Element;
interface SidebarListItemProps<T = unknown> extends Omit<React.ComponentProps<"button">, "onClick" | "title"> {
    /**
     * When `title` is absent, children render as custom row content (escape hatch —
     * avatars, multi-line text, etc). When `title` is set + `collapsible` is true, children
     * are treated as nested items inside the collapsible content.
     */
    children?: React.ReactNode;
    onClick?: () => void;
    /** Explicit selection state. Overridden by context when `item` is provided. */
    selected?: boolean;
    className?: string;
    /** The data item this list item represents. Used with SidebarList's managed selection. */
    item?: T;
    /** Leading icon. SVG children auto-size to `size-4` (16px); pass `size-*` on the icon to override. */
    icon?: React.ReactNode;
    /** Row label. Presence switches the component to props mode (children become nested items when `collapsible`). */
    title?: React.ReactNode;
    /** Secondary text below the title (e.g. "Apple Account" under a user name). */
    subtitle?: React.ReactNode;
    /**
     * Trailing content with `ml-auto` alignment. String/number values are auto-wrapped in the
     * `SidebarListItemAccessory` styling (muted callout, tabular-nums). ReactNode values render as-is.
     */
    accessory?: React.ReactNode;
    /** Wrap this item in a Collapsible. Children become nested items. Requires `title`. */
    collapsible?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Force the item open regardless of user state — e.g. during search. */
    forceOpen?: boolean;
}
export declare function SidebarListItem<T>({ children, onClick, selected, className, item, icon, title, subtitle, accessory, collapsible, defaultOpen, open, onOpenChange, forceOpen, ...props }: SidebarListItemProps<T>): import("react/jsx-runtime").JSX.Element;
export declare namespace SidebarListItem {
    var displayName: string;
}
/** Vertical flex container for title + subtitle. Handles `min-w-0 flex-1` so text truncates correctly. */
export declare function SidebarListItemContent({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
/** Row title — used internally by props mode. Use directly in children mode for consistent styling. */
export declare function SidebarListItemTitle({ className, ...props }: TextProps): import("react/jsx-runtime").JSX.Element;
/** Secondary text below title. Use directly in children mode for consistent styling. */
export declare function SidebarListItemSubtitle({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
/**
 * Trailing accessory slot for `SidebarListItem` — badges, counts, status indicators. Passing
 * `accessory="12"` as a string on `SidebarListItem` auto-wraps it in this styling. Use the
 * component directly when the accessory has multiple pieces (icon + text, status + badge).
 */
export declare function SidebarListItemAccessory({ className, children, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
export declare function SidebarFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
interface ToolbarSearchInputProps {
    ref?: React.Ref<HTMLInputElement>;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
}
export declare const ToolbarSearchInput: React.ForwardRefExoticComponent<Omit<ToolbarSearchInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
/**
 * @deprecated Use Toolbar with ToolbarRow instead.
 * Padding and height are automatically optimized inside sidebars.
 * Example:
 * ```tsx
 * <Toolbar>
 *   <ToolbarRow className="justify-end">
 *     <Button iconOnly>...</Button>
 *   </ToolbarRow>
 *   <ToolbarRow>
 *     <ToolbarSearchInput ... />
 *   </ToolbarRow>
 * </Toolbar>
 * ```
 */
export declare const SidebarToolbar: typeof Toolbar;
/**
 * @deprecated Use ToolbarActions or a simple div with flex instead.
 */
export declare function SidebarToolbarActions({ children, className }: {
    children: React.ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated Use ToolbarSearchInput instead.
 */
export declare const SidebarToolbarSearchInput: React.ForwardRefExoticComponent<Omit<ToolbarSearchInputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export {};
