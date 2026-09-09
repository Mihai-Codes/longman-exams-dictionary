import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const statusVariants: (props?: ({
    variant?: "error" | "warning" | "loading" | "success" | "neutral" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Status({ className, variant, asChild, children, ...props }: React.ComponentProps<"span"> & VariantProps<typeof statusVariants> & {
    asChild?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export { Status };
