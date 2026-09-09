import * as React from "react";
interface ConversationRootProps extends React.ComponentProps<"div"> {
    isAtBottom?: boolean;
    onScrollToBottom?: () => void;
}
declare const Root: React.ForwardRefExoticComponent<Omit<ConversationRootProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Content: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Anchor: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const ScrollToBottom: React.ForwardRefExoticComponent<Omit<import("./button").ButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { Root, Content, Anchor, ScrollToBottom, type ConversationRootProps };
