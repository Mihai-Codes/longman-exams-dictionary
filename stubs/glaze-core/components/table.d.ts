import * as React from "react";
declare function Table({ className, children, ...props }: React.ComponentProps<"table"> & {
    stickyHeader?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function TableHeader({ className, sticky, ...props }: React.ComponentProps<"thead"> & {
    sticky?: boolean;
}): import("react/jsx-runtime").JSX.Element;
declare function TableBody({ className, ...props }: React.ComponentProps<"tbody">): import("react/jsx-runtime").JSX.Element;
declare function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">): import("react/jsx-runtime").JSX.Element;
declare function TableRow({ className, ...props }: React.ComponentProps<"tr">): import("react/jsx-runtime").JSX.Element;
declare function TableHead({ className, ...props }: React.ComponentProps<"th">): import("react/jsx-runtime").JSX.Element;
declare function TableCell({ className, ...props }: React.ComponentProps<"td">): import("react/jsx-runtime").JSX.Element;
declare function TableCaption({ className, ...props }: React.ComponentProps<"caption">): import("react/jsx-runtime").JSX.Element;
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
