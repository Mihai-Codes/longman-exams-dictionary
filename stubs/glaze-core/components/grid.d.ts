import * as React from "react";
interface GridRootProps<T> extends React.ComponentProps<"div"> {
    items: T[];
    selectedItem: T | null;
    onSelectedItemChange: (item: T | null) => void;
    getItemKey: (item: T) => string;
    children: React.ReactNode;
    /** Fixed column count. Ignored when `minColumnWidth` is provided. */
    columns?: number;
    /** Responsive minimum cell width in px — switches the grid to CSS auto-fill. */
    minColumnWidth?: number;
    endThreshold?: number;
    onEndReached?: () => void;
    autoFocus?: boolean;
    onNavigationKeyDown?: (event: React.KeyboardEvent) => void;
}
export interface GridRef {
    focus: () => void;
    handleKeyDown: (event: React.KeyboardEvent) => void;
}
declare const GridRoot: React.ForwardRefExoticComponent<Omit<GridRootProps<any>, "ref"> & React.RefAttributes<GridRef>>;
interface GridItemProps<T> extends Omit<React.ComponentProps<"button">, "onClick" | "onDoubleClick"> {
    item: T;
    children: React.ReactNode;
    onAction?: (item: T) => void;
}
declare function GridItem<T>({ item, children, className, onAction, ...props }: GridItemProps<T>): import("react/jsx-runtime").JSX.Element;
declare namespace GridItem {
    var displayName: string;
}
interface GridItemContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
declare function GridItemContent({ children, className, ...props }: GridItemContentProps): import("react/jsx-runtime").JSX.Element;
declare namespace GridItemContent {
    var displayName: string;
}
interface GridItemTitleProps extends Omit<React.ComponentProps<"h3">, "color"> {
    children: React.ReactNode;
}
declare function GridItemTitle({ children, className, ...props }: GridItemTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace GridItemTitle {
    var displayName: string;
}
interface GridItemDescriptionProps extends Omit<React.ComponentProps<"p">, "color"> {
    children: React.ReactNode;
}
declare function GridItemDescription({ children, className, ...props }: GridItemDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare namespace GridItemDescription {
    var displayName: string;
}
interface GridItemAccessoryProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
declare function GridItemAccessory({ children, className, ...props }: GridItemAccessoryProps): import("react/jsx-runtime").JSX.Element;
declare namespace GridItemAccessory {
    var displayName: string;
}
export { GridRoot as Root, GridItem as Item, GridItemContent as ItemContent, GridItemTitle as ItemTitle, GridItemDescription as ItemDescription, GridItemAccessory as ItemAccessory, };
