import * as React from "react";
export interface NativeWindow extends Window {
    animateOut?: () => void;
    cancelAnimateOut?: () => void;
    onAnimateOutComplete?: () => void;
    ResizeObserver?: typeof ResizeObserver;
}
export interface NativeViewHandle<Win extends NativeWindow> {
    resize: () => void;
    getWindow: () => Win | null;
}
type NativeViewProps<Win extends NativeWindow> = {
    ref?: React.Ref<NativeViewHandle<Win>>;
    children: React.ReactNode;
    feature: "hud" | "tooltip";
    queryParams?: Record<string, string>;
    onReady?: (window: Win) => void;
    onClose?: () => void;
};
export declare function NativeView<Win extends NativeWindow>({ ref, children, feature, queryParams, onClose: onCloseProp, onReady: onReadyProp, }: NativeViewProps<Win>): React.ReactPortal | null;
export declare namespace NativeView {
    var displayName: string;
}
export {};
