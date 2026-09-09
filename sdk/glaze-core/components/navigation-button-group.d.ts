import { type ButtonGroupProps } from "./button-group";
export interface NavigationButtonGroupProps {
    canGoBack: boolean;
    canGoForward: boolean;
    onGoBack: () => void;
    onGoForward: () => void;
    size?: ButtonGroupProps["size"];
    variant?: ButtonGroupProps["variant"];
}
export declare function NavigationButtonGroup({ canGoBack, canGoForward, onGoBack, onGoForward, size, variant, }: NavigationButtonGroupProps): import("react/jsx-runtime").JSX.Element;
