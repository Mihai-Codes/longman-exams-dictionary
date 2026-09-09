import * as React from "react";
interface ShareSheetProps {
    text: string;
    disabled?: boolean;
    onOpen?: () => void;
    onError?: (error: unknown) => void | Promise<void>;
    children: React.ReactNode;
}
declare function ShareSheet({ text, disabled, onOpen, onError, children }: ShareSheetProps): import("react/jsx-runtime").JSX.Element;
interface ShareSheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
declare const ShareSheetTrigger: React.ForwardRefExoticComponent<ShareSheetTriggerProps & React.RefAttributes<HTMLButtonElement>>;
export { ShareSheet, ShareSheetTrigger };
export type { ShareSheetProps, ShareSheetTriggerProps };
