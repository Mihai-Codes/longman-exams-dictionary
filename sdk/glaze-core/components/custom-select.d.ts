import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { VariantProps } from "class-variance-authority";
declare function CustomSelect({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare function CustomSelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): import("react/jsx-runtime").JSX.Element;
declare function CustomSelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): import("react/jsx-runtime").JSX.Element;
declare const customSelectTriggerVariants: (props?: ({
    variant?: "default" | "transparent" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function CustomSelectTrigger({ className, children, size, variant, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof customSelectTriggerVariants>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectTrigger {
    var displayName: string | undefined;
}
declare function CustomSelectContent({ className, children, position, align, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectContent {
    var displayName: string | undefined;
}
declare function CustomSelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectLabel {
    var displayName: string | undefined;
}
declare function CustomSelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectItem {
    var displayName: string | undefined;
}
declare function CustomSelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectSeparator {
    var displayName: string | undefined;
}
declare function CustomSelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectScrollUpButton {
    var displayName: string | undefined;
}
declare function CustomSelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): import("react/jsx-runtime").JSX.Element;
declare namespace CustomSelectScrollDownButton {
    var displayName: string | undefined;
}
export { CustomSelect, CustomSelectContent, CustomSelectGroup, CustomSelectItem, CustomSelectLabel, CustomSelectScrollDownButton, CustomSelectScrollUpButton, CustomSelectSeparator, CustomSelectTrigger, CustomSelectValue, };
