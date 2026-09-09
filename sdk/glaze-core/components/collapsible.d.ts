import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronRightIcon } from "lucide-react";
import { type VariantProps } from "class-variance-authority";
interface CollapsibleRootProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
    /** When `false`, descendant animations/transitions apply with 0ms duration. Default `true`. */
    animated?: boolean;
}
declare function CollapsibleRoot({ className, animated, open: controlledOpen, defaultOpen, onOpenChange, ...props }: CollapsibleRootProps): import("react/jsx-runtime").JSX.Element;
interface CollapsibleChevronProps extends React.ComponentProps<typeof ChevronRightIcon> {
    onToggle?: () => void;
    /** Override the open state read from the nearest `CollapsibleRoot` context. */
    open?: boolean;
}
declare function CollapsibleChevron({ className, onToggle, open: propOpen, strokeWidth, ...props }: CollapsibleChevronProps): import("react/jsx-runtime").JSX.Element;
declare const collapsibleTriggerVariants: (props?: ({
    variant?: "section" | "row" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface CollapsibleTriggerProps extends React.ComponentProps<typeof CollapsiblePrimitive.Trigger>, VariantProps<typeof collapsibleTriggerVariants> {
}
declare function CollapsibleTrigger({ className, variant, children, ...props }: CollapsibleTriggerProps): import("react/jsx-runtime").JSX.Element;
declare function CollapsibleContent({ className, ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Content>): import("react/jsx-runtime").JSX.Element;
export { CollapsibleRoot, CollapsibleTrigger, CollapsibleChevron, CollapsibleContent };
