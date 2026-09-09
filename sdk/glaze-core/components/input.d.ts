import * as React from "react";
import { VariantProps } from "class-variance-authority";
declare const inputVariants: (props?: ({
    variant?: "default" | "filled" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Input({ className, type, size, variant, ...props }: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>): import("react/jsx-runtime").JSX.Element;
export { Input };
