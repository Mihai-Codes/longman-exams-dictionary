import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Label } from "./label";
/**
 * FieldSet — a grouped section of related form rows.
 *
 * When `title` is set, renders `<FieldLegend>` automatically, and if no direct child is a
 * `<FieldGroup>` the children get wrapped in one (the rounded gray container). This collapses
 * the common 4-deep nesting to a single wrapper.
 */
type FieldSetOwnProps = {
    /** Section header. Auto-rendered as a `<FieldLegend>`. */
    title?: React.ReactNode;
    /** Optional section subtext under the legend. Auto-rendered as a `<FieldDescription>`. */
    description?: React.ReactNode;
};
declare function FieldSet({ className, title, description, children, ...props }: Omit<React.ComponentProps<"fieldset">, "title"> & FieldSetOwnProps): import("react/jsx-runtime").JSX.Element;
declare namespace FieldSet {
    var displayName: string;
}
declare function FieldLegend({ className, variant, ...props }: Omit<React.ComponentProps<"legend">, "color"> & {
    variant?: "legend" | "label";
}): import("react/jsx-runtime").JSX.Element;
declare namespace FieldLegend {
    var displayName: string;
}
declare function FieldGroup({ className, children, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare namespace FieldGroup {
    var displayName: string;
}
declare const fieldVariants: (props?: ({
    orientation?: "responsive" | "horizontal" | "vertical" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
/**
 * Field — a single form row.
 *
 * When `label` is set, auto-builds `<FieldContent><FieldLabel/><FieldDescription/></FieldContent>`
 * and wraps the children in a right-aligned, flex-wrapping control slot that prevents buttons
 * from stretching to full width ("sausage buttons"). Default orientation is `horizontal`.
 *
 * **Primitive mode** (no `label`): children are rendered as-is. Default orientation is `vertical`
 * for backwards compatibility with existing call sites that compose `<FieldContent>` manually.
 */
type FieldOwnProps = {
    /** Row label. Auto-rendered as a `<FieldLabel>`. */
    label?: React.ReactNode;
    /** Row subtext. Auto-rendered as a `<FieldDescription>`. */
    description?: React.ReactNode;
    /** Validation error message. Auto-rendered as a `<FieldError>` under the content. */
    error?: React.ReactNode;
};
declare function Field({ className, orientation, label, description, error, children, onClick, disabled, ref, ...props }: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants> & FieldOwnProps & {
    /**
     * Make the row itself interactive — e.g. a settings disclosure row that opens a Dialog.
     * When set, Field renders as `<button>` with hover/active/focus-visible states and keeps
     * its `displayName="Field"` so `FieldGroup`'s auto-divider detection still works. Pair
     * with `Dialog`'s `trigger` prop (`DialogTrigger asChild` spreads onClick via Radix Slot)
     * for the chevron-disclosure pattern — put `<ChevronRightIcon />` as a child.
     *
     * Do NOT mix with interactive children (Input, Switch, Select). `<button>` nesting an
     * interactive element is invalid HTML and breaks focus/click behavior.
     */
    onClick?: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
    ref?: React.Ref<HTMLElement>;
}): import("react/jsx-runtime").JSX.Element;
declare namespace Field {
    var displayName: string;
}
declare function FieldContent({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare namespace FieldContent {
    var displayName: string;
}
declare function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>): import("react/jsx-runtime").JSX.Element;
declare namespace FieldLabel {
    var displayName: string;
}
declare function FieldTitle({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare namespace FieldTitle {
    var displayName: string;
}
declare function FieldDescription({ className, ...props }: Omit<React.ComponentProps<"p">, "color">): import("react/jsx-runtime").JSX.Element;
declare namespace FieldDescription {
    var displayName: string;
}
declare function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div"> & {
    children?: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare namespace FieldSeparator {
    var displayName: string;
}
declare function FieldError({ className, children, errors, ...props }: React.ComponentProps<"div"> & {
    errors?: Array<{
        message?: string;
    } | undefined>;
}): import("react/jsx-runtime").JSX.Element | null;
declare namespace FieldError {
    var displayName: string;
}
export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle, };
