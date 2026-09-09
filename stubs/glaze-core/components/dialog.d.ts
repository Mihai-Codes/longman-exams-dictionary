import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Text } from "./text";
type SideAction = {
    label: React.ReactNode;
    onClick: () => void | Promise<void>;
};
/**
 * Top-level props — collapse the trigger/header/body/footer tree into a single `<Dialog>` call.
 * If any of these props is set, Dialog auto-builds the content tree and `children` becomes the
 * body (wrapped in `DialogBody`). If none are set, Dialog behaves exactly as the Radix root
 * (fallback: consumers compose DialogContent/DialogHeader/... by hand).
 */
type DialogOwnProps = {
    /** Auto-emits a `DialogTrigger asChild` wrapping this node. */
    trigger?: React.ReactNode;
    /** Auto-renders a `DialogTitle` inside the header. */
    title?: React.ReactNode;
    /**
     * Visually hide the title while keeping it in the DOM for screen readers. Use when the
     * trigger already conveys the same meaning and a visible title would be redundant. Radix
     * still sees a `DialogTitle`, so the accessibility warning is satisfied.
     */
    hideTitle?: boolean;
    /** Auto-renders a `DialogDescription` inside the header. */
    description?: React.ReactNode;
    /**
     * Visually hide the description while keeping it in the DOM for screen readers. Use when
     * the dialog body already conveys what the description would say. Radix still sees a
     * `DialogDescription`, so the accessibility warning is satisfied.
     */
    hideDescription?: boolean;
    /** Primary action handler. Enables the auto-built footer with Cancel + Confirm. */
    onConfirm?: () => void | Promise<void>;
    /** Confirm button label. Defaults to "Done". */
    confirmLabel?: React.ReactNode;
    /** Confirm button variant. Defaults to `"accent"`. Use `"destructive"` for deletes. */
    confirmVariant?: "accent" | "destructive";
    /** Disable the confirm button (e.g. when form validation fails). */
    confirmDisabled?: boolean;
    /** Left-aligned destructive action (e.g. "Remove"). Renders before secondary. */
    destructiveAction?: SideAction;
    /** Left-aligned neutral action (e.g. "Reset"). Renders after destructive. */
    secondaryAction?: SideAction;
    /** Forwarded to `DialogContent` when any top-level prop is set. */
    size?: "small" | "medium" | "large" | "xl" | "2xl";
    /** Forwarded to `DialogContent` when any top-level prop is set. */
    showCloseButton?: boolean;
};
type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & DialogOwnProps & {
    showOverlay?: boolean;
};
declare function Dialog({ children, showOverlay, trigger, title, hideTitle, description, hideDescription, onConfirm, confirmLabel, confirmVariant, confirmDisabled, destructiveAction, secondaryAction, size, showCloseButton, open: controlledOpen, defaultOpen, onOpenChange, ...props }: DialogProps): import("react/jsx-runtime").JSX.Element;
declare namespace Dialog {
    var displayName: string;
}
declare function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): import("react/jsx-runtime").JSX.Element;
declare namespace DialogTrigger {
    var displayName: string;
}
declare function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): import("react/jsx-runtime").JSX.Element;
declare function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): import("react/jsx-runtime").JSX.Element;
declare function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): import("react/jsx-runtime").JSX.Element;
declare function DialogContent({ className, children, showCloseButton, overlayClassName, size, style, onKeyDown, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    overlayClassName?: string;
    size?: "small" | "medium" | "large" | "xl" | "2xl";
}): import("react/jsx-runtime").JSX.Element;
declare function DialogHeader({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogBody({ className, scrollAreaClassName, maxHeight, ...props }: React.ComponentProps<"div"> & {
    scrollAreaClassName?: string;
    maxHeight?: string;
}): import("react/jsx-runtime").JSX.Element;
declare function DialogFooter({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function DialogTitle({ className, variant, ...props }: React.ComponentProps<typeof DialogPrimitive.Title> & Pick<React.ComponentProps<typeof Text>, "variant">): import("react/jsx-runtime").JSX.Element;
declare function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): import("react/jsx-runtime").JSX.Element;
export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, };
