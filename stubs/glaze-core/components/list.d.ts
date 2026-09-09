import * as React from "react";
interface ListRootProps<T> extends React.ComponentProps<"div"> {
    items: T[];
    selectedItem?: T | null;
    onSelectedItemChange?: (item: T | null) => void;
    getItemKey: (item: T) => string;
    children: React.ReactNode;
    endThreshold?: number;
    onEndReached?: () => void;
    autoFocus?: boolean;
    onNavigationKeyDown?: (event: React.KeyboardEvent) => void;
}
export interface ListRef {
    focus: () => void;
    handleKeyDown: (event: React.KeyboardEvent) => void;
}
declare const ListRoot: React.ForwardRefExoticComponent<Omit<ListRootProps<any>, "ref"> & React.RefAttributes<ListRef>>;
interface ListItemProps<T> extends Omit<React.ComponentProps<"div">, "onClick"> {
    item: T;
    children: React.ReactNode;
    onClick?: (item: T) => void;
}
declare function ListItem<T>({ item, children, className, onClick, ...props }: ListItemProps<T>): import("react/jsx-runtime").JSX.Element;
declare namespace ListItem {
    var displayName: string;
}
type ListItemIconProps = ({
    children: React.ReactNode;
} & React.ComponentProps<"div">) | ({
    src: string;
    alt: string;
} & React.ComponentProps<"img">);
declare function ListItemIcon(props: ListItemIconProps): import("react/jsx-runtime").JSX.Element;
interface ListItemContentProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
declare function ListItemContent({ children, className, ...props }: ListItemContentProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListItemContent {
    var displayName: string;
}
interface ListItemTitleProps extends Omit<React.ComponentProps<"h2">, "color"> {
    children: React.ReactNode;
}
declare function ListItemTitle({ children, className, ...props }: ListItemTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListItemTitle {
    var displayName: string;
}
interface ListItemDescriptionProps extends Omit<React.ComponentProps<"p">, "color"> {
    children: React.ReactNode;
}
declare function ListItemDescription({ children, className, ...props }: ListItemDescriptionProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListItemDescription {
    var displayName: string;
}
interface ListItemAccessoryProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
declare function ListItemAccessory({ children, className, ...props }: ListItemAccessoryProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListItemAccessory {
    var displayName: string;
}
interface ListSectionProps extends React.ComponentProps<"div"> {
    children: React.ReactNode;
}
declare function ListSection({ children, className, ...props }: ListSectionProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListSection {
    var displayName: string;
}
interface ListSectionTitleProps extends Omit<React.ComponentProps<"h3">, "color"> {
    children: React.ReactNode;
}
declare function ListSectionTitle({ children, className, ...props }: ListSectionTitleProps): import("react/jsx-runtime").JSX.Element;
declare namespace ListSectionTitle {
    var displayName: string;
}
export { ListRoot as Root, ListItem as Item, ListItemIcon as ItemIcon, ListItemContent as ItemContent, ListItemTitle as ItemTitle, ListItemDescription as ItemDescription, ListItemAccessory as ItemAccessory, ListSection as Section, ListSectionTitle as SectionTitle, };
