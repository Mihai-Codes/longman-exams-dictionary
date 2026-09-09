import * as React from "react";
import { type AIStatus } from "./ai-status";
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";
interface ToolRootProps extends React.ComponentProps<typeof CollapsibleRoot> {
    status: AIStatus;
}
declare function Root({ className, status, children, ...props }: ToolRootProps): import("react/jsx-runtime").JSX.Element;
declare function Trigger({ className, children, disabled, ...props }: React.ComponentProps<typeof CollapsibleTrigger>): import("react/jsx-runtime").JSX.Element;
declare function Name({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
declare function Summary({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
declare function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>): import("react/jsx-runtime").JSX.Element;
declare function Input({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function Output({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
declare function Error({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
export { Root, Trigger, Name, Summary, Content, Input, Output, Error, type AIStatus, type ToolRootProps };
