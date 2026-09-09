import * as React from "react";
import { type NativeViewHandle, type NativeWindow, NativeView } from "./native-view";
export type TooltipReferencePosition = {
    x: number;
    y: number;
};
export type TooltipReference = TooltipReferencePosition & {
    width: number;
    height: number;
};
export type TooltipSide = "top" | "bottom" | "left" | "right";
export interface TooltipWindow extends NativeWindow {
}
export interface TooltipNativeViewHandle extends NativeViewHandle<TooltipWindow> {
}
type TooltipNativeViewProps = Omit<React.ComponentProps<typeof NativeView>, "ref" | "feature"> & {
    ref?: React.Ref<TooltipNativeViewHandle>;
    reference: TooltipReference;
    side: TooltipSide;
};
declare function TooltipNativeView({ reference, side, ...props }: TooltipNativeViewProps): import("react/jsx-runtime").JSX.Element;
declare namespace TooltipNativeView {
    var displayName: string;
}
type TooltipProviderContextType = {
    shouldOpenInstantly: () => boolean;
    addActiveTooltip: (id: string) => void;
    removeActiveTooltip: (id: string) => void;
};
declare function TooltipProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
declare function Tooltip({ children, open: controlledOpen }: {
    children: React.ReactNode;
    open?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function TooltipTrigger({ children, asChild, ...props }: {
    children: React.ReactNode;
    asChild?: boolean;
} & React.HTMLAttributes<HTMLElement>): import("react/jsx-runtime").JSX.Element;
type TooltipContentBaseProps = {
    className?: string;
    side?: TooltipSide;
};
type TooltipContentProps = TooltipContentBaseProps & ({
    children: React.ReactNode;
    shortcut?: string[];
} | {
    children?: React.ReactNode;
    shortcut: string[];
});
declare function TooltipContent({ children, className, shortcut, side }: TooltipContentProps): import("react/jsx-runtime").JSX.Element | null;
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipNativeView };
export type { TooltipProviderContextType as TooltipContextType };
