import * as React from "react";
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "./collapsible";
declare function Root({ className, ...props }: React.ComponentProps<typeof CollapsibleRoot>): import("react/jsx-runtime").JSX.Element;
declare function Trigger({ className, children, ...props }: React.ComponentProps<typeof CollapsibleTrigger>): import("react/jsx-runtime").JSX.Element;
declare function Content({ className, children, ...props }: React.ComponentProps<typeof CollapsibleContent>): import("react/jsx-runtime").JSX.Element;
export { Root, Trigger, Content };
