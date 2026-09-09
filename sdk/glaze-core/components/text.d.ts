import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { textVariants } from "./text-variants";
export interface TextProps extends Omit<React.ComponentProps<"span">, "color">, VariantProps<typeof textVariants> {
    /** Render as a different semantic element (`p`, `h1`–`h4`, `label`, …) instead of a `span`. */
    as?: keyof React.JSX.IntrinsicElements;
    /** Compose with an existing element or primitive instead of rendering one (takes precedence over `as`). */
    asChild?: boolean;
}
/**
 * The canonical way to render text. Prefer a variant + semantic color over
 * raw font-size/weight/color utilities.
 */
declare function Text({ className, variant, color, align, truncate, as, asChild, ...props }: TextProps): import("react/jsx-runtime").JSX.Element;
export { Text };
