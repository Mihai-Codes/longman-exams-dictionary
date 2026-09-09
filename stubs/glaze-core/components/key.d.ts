import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare function KeyGroup({ children, className, ...props }: React.ComponentProps<"kbd">): import("react/jsx-runtime").JSX.Element;
declare const keyVariants: (props?: ({
    variant?: "filled" | "outline" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
type KeyProps = React.ComponentProps<"kbd"> & VariantProps<typeof keyVariants>;
declare function Key({ children, className, variant, ...props }: KeyProps): import("react/jsx-runtime").JSX.Element;
export { Key, KeyGroup };
