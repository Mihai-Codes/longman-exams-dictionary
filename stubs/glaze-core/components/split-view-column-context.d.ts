type SplitViewColumnContextValue = {
    isFirst: boolean;
    isLast: boolean;
    /**
     * If set, `Toolbar` uses this as its effective inset (overrides the normal isFirst-based
     * resolution). Lets SplitView request `windowControlsAndButton` for the primary column
     * when a pinned sidebar toggle is active, so content leaves room for the fixed button.
     */
    insetHint?: "none" | "windowControls" | "windowControlsAndButton";
    /**
     * CSS transition value used by Toolbar for its inset padding, kept in sync with the
     * SplitView's collapse animation (direction-aware easing, matching duration). Needed so
     * primary's toolbar padding and the sidebar's flex-basis interpolate at the same rate —
     * without this the title's x-position is non-monotonic during the collapse slide.
     */
    insetTransition?: string;
};
declare const SplitViewColumnContext: import("react").Context<SplitViewColumnContextValue | null>;
declare const useSplitViewColumnContext: () => SplitViewColumnContextValue | null;
export { SplitViewColumnContext, useSplitViewColumnContext };
export type { SplitViewColumnContextValue };
