import * as React from "react";
import { VariantProps } from "class-variance-authority";
declare const textareaVariants: (props?: ({
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Textarea({ className, size, ...props }: Omit<React.ComponentProps<"textarea">, "size"> & VariantProps<typeof textareaVariants>): import("react/jsx-runtime").JSX.Element;
export { Textarea };
