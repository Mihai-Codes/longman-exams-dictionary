import * as React from "react";
interface InspectorProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    /** Title rendered as `ToolbarTitle`. Most inspectors only need this. */
    title?: React.ReactNode;
    /** Trailing toolbar actions. Button children are auto-styled `glass`/`large` via `ScrollArea`'s
     *  content-toolbar defaults. The most common action is `<SplitView.InspectorToggle />`, which
     *  portals to the SplitView frame's trailing edge unless `pinned={false}`. */
    actions?: React.ReactNode;
    /** Escape hatch: pass a fully custom Toolbar. Overrides `title` and `actions`. */
    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    scrollEnabled?: boolean;
}
declare function Inspector({ children, className, style, title, actions, toolbar, footer, scrollEnabled, }: InspectorProps): import("react/jsx-runtime").JSX.Element;
declare namespace Inspector {
    var displayName: string;
}
type InspectorSectionOwnProps = {
    /** Section header. Omit to render a group with no visible header. */
    title?: React.ReactNode;
    /** Trailing slot on the header row — e.g. a "+" button that adds a layer (Figma
     *  fill/stroke/effects pattern). Sits to the right of the title; when the section
     *  is also collapsible, it sits before the chevron. */
    actions?: React.ReactNode;
    /** Wrap the section in a Collapsible with a chevron on the header. */
    collapsible?: boolean;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};
declare function InspectorSection({ className, title, actions, collapsible, defaultOpen, open, onOpenChange, children, ...props }: React.ComponentProps<"section"> & InspectorSectionOwnProps): import("react/jsx-runtime").JSX.Element;
declare namespace InspectorSection {
    var displayName: string;
}
type InspectorRowOwnProps = {
    /** Label text. With a label, the row defaults to a grid `[label · control]`.
     *  Without, the row is full-width flex. */
    label?: React.ReactNode;
    /** Layout when a label is present. Default `"horizontal"` places the label in a
     *  fixed column next to the control. Use `"vertical"` when the control needs the
     *  full row width (multi-option SegmentedControls, wide clusters) — the label
     *  stacks above the control and both span the whole row. */
    orientation?: "horizontal" | "vertical";
};
declare function InspectorRow({ className, label, orientation, children, style, ...props }: React.ComponentProps<"div"> & InspectorRowOwnProps): import("react/jsx-runtime").JSX.Element;
declare namespace InspectorRow {
    var displayName: string;
}
declare function InspectorRowLabel({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
export { Inspector, InspectorSection, InspectorRow, InspectorRowLabel };
