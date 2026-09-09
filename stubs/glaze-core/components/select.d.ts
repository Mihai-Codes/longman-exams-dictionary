import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { type NativeMenuIcon } from "../utils/native-menu-helpers";
interface SelectItemProps {
    /** Value for this item */
    value: string;
    /** Secondary text displayed below the label */
    sublabel?: string;
    /** Icon (SF Symbol name or image path) */
    icon?: NativeMenuIcon;
    /** Whether this item is disabled */
    disabled?: boolean;
    /** Display text (children) */
    children: React.ReactNode;
}
declare function SelectItem(_props: SelectItemProps): null;
interface SelectGroupProps {
    children: React.ReactNode;
}
declare function SelectGroup(_props: SelectGroupProps): null;
interface SelectLabelProps {
    children: React.ReactNode;
}
declare function SelectLabel(_props: SelectLabelProps): null;
declare function SelectSeparator(): null;
interface SelectContentProps {
    children: React.ReactNode;
}
declare function SelectContent(_props: SelectContentProps): null;
interface SelectProps {
    /** Currently selected value (controlled) */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Callback when value changes */
    onValueChange?: (value: string) => void;
    /** Whether the select is disabled */
    disabled?: boolean;
    /** Children (SelectTrigger and SelectContent) */
    children: React.ReactNode;
}
declare function Select({ value, defaultValue, onValueChange, disabled, children }: SelectProps): import("react/jsx-runtime").JSX.Element;
declare const selectTriggerVariants: (props?: ({
    variant?: "default" | "transparent" | "filled" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
    shape?: "default" | "pill" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
interface SelectTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onKeyDown" | "size">, VariantProps<typeof selectTriggerVariants> {
    /** Hide the built-in chevron indicator */
    hideChevron?: boolean;
    /** Shape of the trigger */
    shape?: "default" | "pill";
}
declare const SelectTrigger: React.ForwardRefExoticComponent<SelectTriggerProps & React.RefAttributes<HTMLButtonElement>>;
interface SelectValueProps {
    /** Placeholder text when no value is selected */
    placeholder?: string;
    /** Custom className */
    className?: string;
}
declare function SelectValue({ placeholder, className }: SelectValueProps): import("react/jsx-runtime").JSX.Element;
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, SelectSeparator };
