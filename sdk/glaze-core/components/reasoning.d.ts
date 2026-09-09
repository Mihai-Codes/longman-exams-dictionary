import * as React from "react";
import { type AIStatus } from "./ai-status";
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";
type ReasoningStatus = AIStatus | "streaming";
interface ReasoningRootProps extends React.ComponentProps<typeof CollapsibleRoot> {
    status?: ReasoningStatus;
}
declare function Root({ className, status, children, ...props }: ReasoningRootProps): import("react/jsx-runtime").JSX.Element;
declare function Trigger({ className, children, disabled, ...props }: React.ComponentProps<typeof CollapsibleTrigger>): import("react/jsx-runtime").JSX.Element;
declare function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>): import("react/jsx-runtime").JSX.Element;
export { Root, Trigger, Content, type ReasoningStatus, type ReasoningRootProps };
