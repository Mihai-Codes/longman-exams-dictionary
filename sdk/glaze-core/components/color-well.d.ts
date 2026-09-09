import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const swatchSizeVariants: (props?: ({
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type ColorWellProps = Omit<React.ComponentProps<"input">, "onChange" | "value" | "type" | "size"> & VariantProps<typeof swatchSizeVariants> & {
    /** CSS color value — hex (`#RRGGBB` / `#RRGGBBAA`) or any CSS color. Omit / pass
     *  `null` for the empty state (renders just the checkerboard). */
    value?: string | null;
    /** Fires when the user picks a new color. Omit to render a read-only swatch. */
    onChange?: (value: string) => void;
    /** Display-only swatch; no picker, not focusable. */
    readOnly?: boolean;
};
declare function ColorWell({ value, onChange, size, readOnly, className, ...props }: ColorWellProps): import("react/jsx-runtime").JSX.Element;
declare namespace ColorWell {
    var displayName: string;
}
export { ColorWell };
