import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { type ButtonProps } from "./button";
/**
 * Top-level props — collapse the trigger/header/body/footer tree into a single `<AlertDialog>`
 * call. AlertDialog is for single-decision confirmations, so it intentionally does *not* accept
 * `destructiveAction`/`secondaryAction` (use the left-aligned actions on `Dialog` for those).
 *
 * If any of these props are set *and* `onConfirm` is provided, AlertDialog auto-builds the content
 * tree and `children` becomes the body (wrapped in `AlertDialogBody`). Without `onConfirm`,
 * AlertDialog falls back to composition so we don't create an un-dismissible alert.
 */
type AlertDialogOwnProps = {
    /** Auto-emits an `AlertDialogTrigger asChild` wrapping this node. */
    trigger?: React.ReactNode;
    /** Auto-renders an `AlertDialogTitle` inside the header. */
    title?: React.ReactNode;
    /**
     * Visually hide the title while keeping it in the DOM for screen readers. Radix still sees
     * an `AlertDialogTitle`, so the accessibility warning is satisfied.
     */
    hideTitle?: boolean;
    /** Auto-renders an `AlertDialogDescription` inside the header. */
    description?: React.ReactNode;
    /**
     * Visually hide the description while keeping it in the DOM for screen readers. Radix still
     * sees an `AlertDialogDescription`, so the accessibility warning is satisfied.
     */
    hideDescription?: boolean;
    /** Primary action handler. Required when any other top-level prop is set (Cancel + Confirm footer). */
    onConfirm?: () => void | Promise<void>;
    /** Confirm button label. Defaults to "Confirm". */
    confirmLabel?: React.ReactNode;
    /** Confirm button variant. Defaults to `"accent"`. Use `"destructive"` for deletes. */
    confirmVariant?: "accent" | "destructive";
    /** Disable the confirm button (e.g. when a typed confirmation doesn't match). */
    confirmDisabled?: boolean;
    /** Forwarded to `AlertDialogContent` when any top-level prop is set. */
    size?: "small" | "medium" | "large" | "xl" | "2xl";
};
declare function AlertDialog({ children, trigger, title, hideTitle, description, hideDescription, onConfirm, confirmLabel, confirmVariant, confirmDisabled, size, open: controlledOpen, defaultOpen, onOpenChange, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root> & AlertDialogOwnProps): import("react/jsx-runtime").JSX.Element;
declare namespace AlertDialog {
    var displayName: string;
}
declare function AlertDialogTrigger({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare namespace AlertDialogTrigger {
    var displayName: string;
}
declare function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogOverlay({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogContent({ className, children, size, style, onKeyDown, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
    size?: "small" | "medium" | "large" | "xl" | "2xl";
}): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogBody({ className, scrollAreaClassName, ...props }: React.ComponentProps<"div"> & {
    scrollAreaClassName?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): import("react/jsx-runtime").JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
type AlertDialogActionAsChildProps = React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
    asChild: true;
};
type AlertDialogActionSelfRenderProps = Omit<ButtonProps, "ref"> & {
    asChild?: false;
};
type AlertDialogActionProps = AlertDialogActionAsChildProps | AlertDialogActionSelfRenderProps;
/**
 * Confirm action for an AlertDialog. Two modes:
 *
 * - Without `asChild`: AlertDialogAction renders its own `<Button>`, accepts Button props
 *   (variant, className, ...), registers itself as the confirm shortcut target, defaults to
 *   `flex-1` (macOS native two-button alert pattern), and renders the keyboard hint inline.
 *   Use this for new call sites.
 * - With `asChild`: classic Radix passthrough. The inner element still receives the confirm
 *   ref (so Cmd/Enter still fires it), but the keyboard hint and `flex-1` default are not
 *   auto-applied — the caller owns the button's children and styling.
 */
declare function AlertDialogAction(props: AlertDialogActionProps): import("react/jsx-runtime").JSX.Element;
type AlertDialogCancelAsChildProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & {
    asChild: true;
};
type AlertDialogCancelSelfRenderProps = Omit<ButtonProps, "ref"> & {
    asChild?: false;
};
type AlertDialogCancelProps = AlertDialogCancelAsChildProps | AlertDialogCancelSelfRenderProps;
declare function AlertDialogCancel(props: AlertDialogCancelProps): import("react/jsx-runtime").JSX.Element;
export { AlertDialog, AlertDialogAction, AlertDialogBody, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, };
