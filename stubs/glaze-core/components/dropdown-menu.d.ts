import * as React from "react";
import { type NativeMenuIcon, type DropdownMenuSide, type DropdownMenuAlign } from "../hooks/use-native-dropdown-menu";
import { type MenuItemColor } from "../backend/menu.js";
interface DropdownMenuItemProps {
    icon?: NativeMenuIcon;
    sublabel?: string;
    accelerator?: string;
    disabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    onSelect?: () => void;
    children: React.ReactNode;
}
declare function DropdownMenuItem(_props: DropdownMenuItemProps): null;
interface DropdownMenuCheckboxItemProps {
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
declare function DropdownMenuCheckboxItem(_props: DropdownMenuCheckboxItemProps): null;
declare function DropdownMenuSeparator(): null;
interface DropdownMenuLabelProps {
    children: React.ReactNode;
}
declare function DropdownMenuLabel(_props: DropdownMenuLabelProps): null;
interface DropdownMenuSubProps {
    label: string;
    icon?: NativeMenuIcon;
    disabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    children: React.ReactNode;
}
declare function DropdownMenuSub(_props: DropdownMenuSubProps): null;
interface DropdownMenuGroupProps {
    children: React.ReactNode;
}
declare function DropdownMenuGroup(_props: DropdownMenuGroupProps): null;
interface DropdownMenuProps {
    /** Element whose bounds position the menu. Falls back to the trigger when omitted or unavailable. */
    anchorRef?: React.RefObject<HTMLElement | null>;
    disabled?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    children: React.ReactNode;
}
declare function DropdownMenu({ anchorRef, disabled, onClose, onOpen, children }: DropdownMenuProps): import("react/jsx-runtime").JSX.Element;
interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}
declare const DropdownMenuTrigger: React.ForwardRefExoticComponent<DropdownMenuTriggerProps & React.RefAttributes<HTMLButtonElement>>;
interface DropdownMenuContentProps {
    side?: DropdownMenuSide;
    align?: DropdownMenuAlign;
    sideOffset?: number;
    alignOffset?: number;
    children: React.ReactNode;
}
declare function DropdownMenuContent(_props: DropdownMenuContentProps): null;
declare namespace DropdownMenuContent {
    var displayName: string;
}
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuSub, DropdownMenuGroup, };
export type { NativeMenuIcon, DropdownMenuSide, DropdownMenuAlign };
