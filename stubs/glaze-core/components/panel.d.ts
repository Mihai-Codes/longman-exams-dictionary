import React from "react";
type PanelGroupProps = {
    children: React.ReactNode;
    orientation?: "horizontal" | "vertical";
    className?: string;
    onChange?: (sizes: number[]) => void;
    onResizeStateChange?: (isDragging: boolean) => void;
    storageKey?: string;
};
type PanelProps = {
    children: React.ReactNode;
    minSize?: number;
    maxSize?: number;
    defaultSize?: number;
    className?: string;
    hidden?: boolean;
    style?: React.CSSProperties;
    /**
     * Which edge the contents stay anchored to when the panel collapses. Combined with the
     * `min-width` on the inner wrapper, this produces the "content slides out of view in one
     * direction" effect (no squishing). `"start"` (default) keeps content pinned to the leading
     * edge — natural for trailing panels like inspectors. `"end"` pins it to the trailing edge —
     * use for leading panels like sidebars, so the right edge stays visible while the left side
     * gets cut off as the panel collapses.
     */
    anchor?: "start" | "end";
};
declare const PanelGroup: ({ children, orientation, className, onChange, onResizeStateChange, storageKey, }: PanelGroupProps) => import("react/jsx-runtime").JSX.Element;
declare const Panel: {
    ({ children, className, minSize: _minSize, maxSize: _maxSize, defaultSize: _defaultSize, hidden: _hidden, anchor: _anchor, style, ...props }: PanelProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { PanelGroup, Panel };
