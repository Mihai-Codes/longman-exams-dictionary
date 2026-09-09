import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
declare function TabsRoot({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>): import("react/jsx-runtime").JSX.Element;
declare const tabsVariants: (props?: ({
    variant?: "transparent" | "filled" | "glass" | null | undefined;
    size?: "small" | "medium" | "large" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface TabsProps extends React.ComponentProps<typeof TabsPrimitive.List>, VariantProps<typeof tabsVariants> {
}
declare function Tabs({ className, variant, size, ...props }: TabsProps): import("react/jsx-runtime").JSX.Element;
declare function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>): import("react/jsx-runtime").JSX.Element;
declare function TabsSeparator(): import("react/jsx-runtime").JSX.Element;
export { TabsRoot, Tabs, TabsTrigger, TabsSeparator, TabsContent };
