import * as React from "react";
import { type NativeMenuIcon } from "../utils/native-menu-helpers";
import { type MenuItemColor } from "../backend/menu.js";
interface ContextMenuItemProps {
    icon?: NativeMenuIcon;
    sublabel?: string;
    accelerator?: string;
    disabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    onSelect?: () => void;
    children: React.ReactNode;
}
declare function ContextMenuItem(_props: ContextMenuItemProps): null;
interface ContextMenuCheckboxItemProps {
    icon?: NativeMenuIcon;
    sublabel?: string;
    accelerator?: string;
    disabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children: React.ReactNode;
}
declare function ContextMenuCheckboxItem(_props: ContextMenuCheckboxItemProps): null;
declare function ContextMenuSeparator(): null;
interface ContextMenuLabelProps {
    children: React.ReactNode;
}
declare function ContextMenuLabel(_props: ContextMenuLabelProps): null;
interface ContextMenuSubProps {
    label: string;
    icon?: NativeMenuIcon;
    disabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    children: React.ReactNode;
}
declare function ContextMenuSub(_props: ContextMenuSubProps): null;
interface ContextMenuGroupProps {
    children: React.ReactNode;
}
declare function ContextMenuGroup(_props: ContextMenuGroupProps): null;
interface ContextMenuProps {
    disabled?: boolean;
    highlightTrigger?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    children: React.ReactNode;
}
declare function ContextMenu({ disabled, highlightTrigger, onClose, onOpen, children }: ContextMenuProps): import("react/jsx-runtime").JSX.Element;
interface ContextMenuTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
}
declare function ContextMenuTrigger({ asChild, children }: ContextMenuTriggerProps): import("react/jsx-runtime").JSX.Element;
declare namespace ContextMenuTrigger {
    var displayName: string;
}
interface ContextMenuContentProps {
    children: React.ReactNode;
}
declare function ContextMenuContent(_props: ContextMenuContentProps): null;
declare namespace ContextMenuContent {
    var displayName: string;
}
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuSeparator, ContextMenuLabel, ContextMenuSub, ContextMenuGroup, };
export type { NativeMenuIcon };
