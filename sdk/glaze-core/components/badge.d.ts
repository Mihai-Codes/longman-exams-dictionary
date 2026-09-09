import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { badgeVariants, type BadgeColor } from "./badge-variants";
export interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {
    /** Color treatment. Defaults to `secondary` (soft neutral). */
    color?: BadgeColor;
    /** Render as the child element (e.g. an `<a>`) instead of a `<span>`. */
    asChild?: boolean;
}
/**
 * A small, non-interactive label for statuses, counts, tags, and categories. Inline-flex with a
 * pill radius; `color` carries the meaning as a same-hue tint, coloring the text and any leading
 * icon.
 */
declare function Badge({ className, color, size, asChild, ...props }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export { Badge };
