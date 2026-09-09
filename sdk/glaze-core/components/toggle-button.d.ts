import * as React from "react";
import { Toggle as TogglePrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
/**
 * ToggleButton — single pressed/unpressed button. Use for isolated toggle
 * controls like flip / lock / show-hide, where a `SegmentedControl` with one item
 * would be semantically weird and a plain `Button` doesn't carry pressed state.
 *
 * Wraps Radix `Toggle.Root` — ships `pressed` / `defaultPressed` / `onPressedChange`
 * out of the box along with proper `aria-pressed` and keyboard Space/Enter handling.
 *
 * Chrome mirrors `Button` when unpressed (sizes, radius, icon-only compound) but the
 * `filled` variant's unpressed fill is `control-subtle` — same as `Input` / `Select` /
 * `NumberInput` / `SegmentedControl` filled — so a toggle button sits seamlessly
 * next to those other controls in an inspector row. When pressed, the background
 * switches to the system accent.
 */
declare const toggleButtonVariants: (props?: ({
    variant?: "transparent" | "filled" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
    iconOnly?: boolean | null | undefined;
    radius?: "full" | "rounded" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ToggleButtonProps extends Omit<React.ComponentProps<typeof TogglePrimitive.Root>, "size">, VariantProps<typeof toggleButtonVariants> {
}
declare function ToggleButton({ className, variant, size, iconOnly, radius, ...props }: ToggleButtonProps): import("react/jsx-runtime").JSX.Element;
declare namespace ToggleButton {
    var displayName: string;
}
export { ToggleButton };
