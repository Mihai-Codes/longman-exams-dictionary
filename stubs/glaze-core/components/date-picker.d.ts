import * as React from "react";
import { VariantProps } from "class-variance-authority";
type NativeDatePickerType = "date" | "time" | "dateAndTime";
interface NativeDatePickerRootProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    type?: NativeDatePickerType;
    disabled?: boolean;
    min?: string;
    max?: string;
    children: React.ReactNode;
}
declare function NativeDatePickerRoot({ value: controlledValue, defaultValue, onValueChange, type, disabled, min, max, children, }: NativeDatePickerRootProps): import("react/jsx-runtime").JSX.Element;
declare const nativeDatePickerTriggerVariants: (props?: ({
    variant?: "default" | "transparent" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface NativeDatePickerTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">, VariantProps<typeof nativeDatePickerTriggerVariants> {
    asChild?: boolean;
}
declare function NativeDatePickerTrigger({ className, children, size, variant, asChild, ...props }: NativeDatePickerTriggerProps): import("react/jsx-runtime").JSX.Element;
interface NativeDatePickerValueProps extends React.HTMLAttributes<HTMLSpanElement> {
    placeholder?: string;
    format?: (value: string, type: NativeDatePickerType) => string;
}
declare function NativeDatePickerValue({ placeholder, format, className, ...props }: NativeDatePickerValueProps): import("react/jsx-runtime").JSX.Element;
export { NativeDatePickerRoot, NativeDatePickerTrigger, NativeDatePickerValue, type NativeDatePickerType, type NativeDatePickerRootProps, type NativeDatePickerTriggerProps, type NativeDatePickerValueProps, };
