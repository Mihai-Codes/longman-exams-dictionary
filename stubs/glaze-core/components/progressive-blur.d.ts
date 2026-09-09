import React from "react";
export interface ProgressiveBlurProps {
    className?: string;
    height?: string;
    position?: "top" | "bottom" | "both";
    blurLevels?: number[];
    children?: React.ReactNode;
}
export declare function ProgressiveBlur({ className, height, position, blurLevels, }: ProgressiveBlurProps): import("react/jsx-runtime").JSX.Element;
