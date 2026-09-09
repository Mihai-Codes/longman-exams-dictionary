import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
export type ScrollAreaControl = {
    /** Scroll to bottom unconditionally, properly setting internal tracking state. */
    forceScrollToBottom: () => void;
    /**
     * Freeze auto-follow-bottom during a programmatic scroll correction (e.g. a
     * reverse-pagination prepend); reference-counted — pair with `resumeAutoFollow()`
     * @internal
     */
    suspendAutoFollow: () => void;
    /**
     * Resume auto-follow-bottom; on the final resume the at-bottom belief is recomputed from live geometry
     * @internal
     */
    resumeAutoFollow: () => void;
};
type ScrollAreaProps = {
    /**
     * Escape hatch: pass a fully custom `<Toolbar>`. Takes precedence over `title`/`subtitle`/`actions`.
     */
    toolbar?: React.ReactNode;
    /**
     * Renders a `<ToolbarTitle>` inside an auto-built Toolbar. Should describe
     * the active view: filename, selected item, section name. **Not** the app name. macOS
     * convention: Preview shows `"IMG_0042.png"`, not `"Preview"`. For simple apps (calculators,
     * clocks) with no view context, omit this prop entirely. Ignored when `toolbar` is also set.
     */
    title?: React.ReactNode;
    /**
     * Renders a `<ToolbarDescription>` under the title inside the auto-built Toolbar.
     * Ignored when `toolbar` is also set.
     */
    subtitle?: React.ReactNode;
    /**
     * Renders action buttons in a `<ToolbarActions>` slot. Button children are
     * auto-styled with `variant="glass" size="large"` (content-area defaults) through any wrappers
     * (Tooltip, DropdownMenuTrigger asChild, Popover.Trigger asChild). Ignored when `toolbar` is set.
     */
    actions?: React.ReactNode;
    /**
     * Content rendered on the leading (left) edge of the auto-built Toolbar, before the title.
     * Primary use is a back affordance on detail pages — pass `<ToolbarBackButton onClick={...} />`.
     * Button children are auto-styled with content-area defaults (`variant="glass" size="large"`),
     * same as `actions`. Ignored when `toolbar` is set.
     */
    leading?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    viewportClassName?: string;
    fadeEdges?: boolean;
    autoScrollToBottom?: boolean;
    /** Behavior used when auto-following content changes. Defaults to `instant`. */
    autoScrollBehavior?: ScrollBehavior;
    autoScrollDeps?: React.DependencyList;
    showScrollToBottomButton?: boolean;
    scrollbars?: "vertical" | "horizontal" | "both";
    scrollbarBottomOffset?: number;
    scrollbarTopOffset?: number;
    scrollControlRef?: React.MutableRefObject<ScrollAreaControl | null>;
} & Omit<React.ComponentProps<typeof ScrollAreaPrimitive.Root>, "title">;
declare const ScrollArea: React.ForwardRefExoticComponent<Omit<ScrollAreaProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { ScrollArea };
