import * as React from "react";
import { type NativeMenuIcon } from "../utils/native-menu-helpers";
export interface NativeSelectItem {
    value: string;
    label: string;
    sublabel?: string;
    icon?: NativeMenuIcon;
    disabled?: boolean;
}
export interface NativeSelectGroup {
    label?: string;
    items: NativeSelectItem[];
}
export type NativeSelectOption = NativeSelectItem | NativeSelectGroup | "separator";
export interface UseNativeSelectOptions {
    /** Currently selected value (controlled) */
    value?: string;
    /** Default value (uncontrolled) */
    defaultValue?: string;
    /** Callback when value changes */
    onValueChange?: (value: string) => void;
    /** Items to display in the select */
    items: NativeSelectOption[];
    /** Whether the select is disabled */
    disabled?: boolean;
    /** Placeholder text when no value is selected */
    placeholder?: string;
}
export interface UseNativeSelectReturn {
    /** Current selected value */
    selectedValue: string | undefined;
    /** Currently selected item */
    selectedItem: NativeSelectItem | undefined;
    /** Props to spread on the trigger element */
    triggerProps: {
        onMouseDown: (event: React.MouseEvent) => void;
        onClick: (event: React.MouseEvent) => void;
        onKeyDown: (event: React.KeyboardEvent) => void;
        role: "combobox";
        "aria-haspopup": "listbox";
        "aria-expanded": boolean;
        "aria-disabled": boolean | undefined;
        tabIndex: number;
    };
    /** Whether the menu is currently open */
    isOpen: boolean;
    /** Trigger ref to attach to the trigger element */
    triggerRef: React.RefObject<HTMLElement | null>;
}
export declare function useNativeSelect(options: UseNativeSelectOptions): UseNativeSelectReturn;
