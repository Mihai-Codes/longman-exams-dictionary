import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { type ButtonProps } from "./button";
export interface ToolbarRowProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}
declare function ToolbarRow({ children, className, ...props }: ToolbarRowProps): import("react/jsx-runtime").JSX.Element;
declare namespace ToolbarRow {
    var displayName: string;
}
export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    position?: "top" | "bottom";
    /**
     * Control the inset behavior for window controls.
     * - If provided explicitly, that value is used
     * - If not provided, resolved in this order:
     *   1. `SplitViewColumnContext.isFirst === true` → `windowControls`
     *   2. `PanelContext.isFirstPanel` + horizontal orientation → `windowControls`
     *   3. Not in any panel/layout context → `windowControls` (default safe behavior)
     *   4. Otherwise → `none`
     *
     * Note: Only the first ToolbarRow receives the inset. Subsequent rows have no inset.
     */
    inset?: "none" | "windowControls" | "windowControlsAndButton";
    background?: "progressive-blur" | "full-blur";
    /** When true, skip height/layout transitions on the toolbar content wrapper (e.g. docked composer). */
    disableLayoutTransition?: boolean;
}
declare function Toolbar({ children, className, position, inset, background, disableLayoutTransition, ...props }: ToolbarProps): import("react/jsx-runtime").JSX.Element;
declare function ToolbarContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
/**
 * Title for the current view. Describes what the user is looking at — active filename,
 * selected item, or section name — **not** the app name. macOS convention: Preview shows
 * `"IMG_0042.png"`, Safari shows the page title. For simple apps (calculators, clocks) with
 * no view context, omit the title entirely.
 */
declare function ToolbarTitle({ children, className, ...props }: Omit<React.ComponentProps<"h2">, "color">): import("react/jsx-runtime").JSX.Element;
declare function ToolbarDescription({ children, className, ...props }: Omit<React.ComponentProps<"p">, "color">): import("react/jsx-runtime").JSX.Element;
declare function ToolbarActions({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
export interface ToolbarBackButtonProps extends Omit<ButtonProps, "children" | "iconOnly"> {
    /** Accessible label + tooltip for the button. Defaults to `"Back"`. */
    label?: string;
}
/**
 * Pre-composed icon-only back button for detail-page toolbars — a chevron in a glass button,
 * matching the native macOS back affordance. Wire your own navigation via `onClick` (e.g.
 * `router.history.back()`). Drop it into a Toolbar's leading position, the `leading` sugar prop
 * of `ScrollArea`, or a sidebar toolbar (`variant="transparent" size="small"`).
 *
 * For paired back/forward navigation (settings, history), use `NavigationButtonGroup` instead.
 */
declare function ToolbarBackButton({ label, variant, size, ...props }: ToolbarBackButtonProps): import("react/jsx-runtime").JSX.Element;
declare namespace ToolbarBackButton {
    var displayName: string;
}
export type ToolbarSearchButtonRef = {
    focus: () => void;
    blur: () => void;
};
declare const ToolbarSearchButton: React.ForwardRefExoticComponent<VariantProps<(props?: ({
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string> & {
    value: string;
    onChange: (value: string) => void;
} & React.RefAttributes<ToolbarSearchButtonRef>>;
export { Toolbar, ToolbarRow, ToolbarTitle, ToolbarDescription, ToolbarContent, ToolbarActions, ToolbarBackButton, ToolbarSearchButton, };
