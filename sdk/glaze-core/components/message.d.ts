import * as React from "react";
type MessageFrom = "user" | "assistant" | "system";
type MessageActionSide = "top" | "bottom" | "left" | "right";
interface MessageRootProps extends React.ComponentProps<"article"> {
    from: MessageFrom;
}
declare const Root: React.ForwardRefExoticComponent<Omit<MessageRootProps, "ref"> & React.RefAttributes<HTMLElement>>;
declare const Content: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Actions: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface MessageActionProps extends React.HTMLAttributes<HTMLElement> {
    asChild?: boolean;
    tooltip?: React.ReactNode;
    side?: MessageActionSide;
}
declare const Action: React.ForwardRefExoticComponent<MessageActionProps & React.RefAttributes<HTMLElement>>;
export { Root, Content, Actions, Action, type MessageFrom, type MessageRootProps, type MessageActionProps, type MessageActionSide, };
