import * as React from "react";
import { type AIStatus } from "./ai-status";
declare function Root({ className, ...props }: React.ComponentProps<"div">): import("react/jsx-runtime").JSX.Element;
interface TaskListItemProps extends React.ComponentProps<"div"> {
    status: AIStatus;
}
declare function Item({ className, status, children, ...props }: TaskListItemProps): import("react/jsx-runtime").JSX.Element;
export { Root, Item, type AIStatus, type TaskListItemProps };
