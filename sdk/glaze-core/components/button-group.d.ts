import { VariantProps } from "class-variance-authority";
import * as React from "react";
export declare function ButtonGroupSeparator(): import("react/jsx-runtime").JSX.Element;
declare const buttonGroupVariants: (props?: ({
    variant?: "transparent" | "filled" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonGroupProps extends React.ComponentProps<"div">, VariantProps<typeof buttonGroupVariants> {
}
export declare function ButtonGroup({ children, variant, size, className }: ButtonGroupProps): import("react/jsx-runtime").JSX.Element;
export {};
