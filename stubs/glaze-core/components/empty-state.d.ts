import * as React from "react";
declare function EmptyStateMedia({ children, className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function EmptyStateTitle({ children, className, ...props }: Omit<React.ComponentProps<"h1">, "color">): import("react/jsx-runtime").JSX.Element;
declare function EmptyStateDescription({ children, className, ...props }: Omit<React.ComponentProps<"p">, "color">): import("react/jsx-runtime").JSX.Element;
declare function EmptyStateActions({ children, className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
    placement?: "center" | "inline" | "viewport";
    /** Heading text. Mutually exclusive with an `EmptyStateTitle` child. */
    title?: React.ReactNode;
    /** Supporting text below the title. */
    description?: React.ReactNode;
    /** Action buttons (one or multiple). */
    actions?: React.ReactNode;
    /** Icon or illustration above the title. Rarely needed — native macOS apps usually omit media in empty states. */
    media?: React.ReactNode;
};
declare function EmptyState({ children, className, placement, title, description, actions, media, style, ...props }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
export { EmptyState, EmptyStateTitle, EmptyStateDescription, EmptyStateActions, EmptyStateMedia };
