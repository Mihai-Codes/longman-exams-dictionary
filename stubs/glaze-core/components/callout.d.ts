import * as React from "react";
import { type BadgeColor } from "./badge-variants";
export type CalloutColor = BadgeColor;
export interface CalloutProps extends Omit<React.ComponentProps<"div">, "color"> {
    /** Color treatment. Matches Badge colors and defaults to `secondary` (soft neutral). */
    color?: CalloutColor;
    /** Optional leading icon for the props API. */
    icon?: React.ReactNode;
    /** Optional trailing actions, usually one small Button. */
    actions?: React.ReactNode;
    /** Adds a trailing dismiss button. */
    onDismiss?: () => void;
    /** Accessible label for the dismiss button. */
    dismissLabel?: string;
}
declare function CalloutRoot({ className, color, icon, actions, onDismiss, dismissLabel, children, ...props }: CalloutProps): import("react/jsx-runtime").JSX.Element;
declare namespace CalloutRoot {
    var displayName: string;
}
type CalloutIconProps = React.ComponentProps<"div">;
declare function CalloutIcon({ className, ...props }: CalloutIconProps): import("react/jsx-runtime").JSX.Element;
declare namespace CalloutIcon {
    var displayName: string;
}
type CalloutTextProps = React.ComponentProps<"p">;
declare function CalloutText({ className, ...props }: CalloutTextProps): import("react/jsx-runtime").JSX.Element;
declare namespace CalloutText {
    var displayName: string;
}
type CalloutActionsProps = React.ComponentProps<"div">;
declare function CalloutActions({ className, ...props }: CalloutActionsProps): import("react/jsx-runtime").JSX.Element;
declare namespace CalloutActions {
    var displayName: string;
}
export interface CalloutCloseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    label?: string;
}
declare function CalloutClose({ className, label, "aria-label": ariaLabel, ...props }: CalloutCloseProps): import("react/jsx-runtime").JSX.Element;
declare namespace CalloutClose {
    var displayName: string;
}
declare const Callout: typeof CalloutRoot & {
    Icon: typeof CalloutIcon;
    Text: typeof CalloutText;
    Actions: typeof CalloutActions;
    Close: typeof CalloutClose;
};
export { Callout };
