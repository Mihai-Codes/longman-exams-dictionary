import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
declare const CustomContextMenu: React.FC<ContextMenuPrimitive.ContextMenuProps>;
declare const CustomContextMenuTrigger: React.ForwardRefExoticComponent<ContextMenuPrimitive.ContextMenuTriggerProps & React.RefAttributes<HTMLSpanElement>>;
declare const CustomContextMenuGroup: React.ForwardRefExoticComponent<ContextMenuPrimitive.ContextMenuGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuPortal: React.FC<ContextMenuPrimitive.ContextMenuPortalProps>;
declare const CustomContextMenuSub: React.FC<ContextMenuPrimitive.ContextMenuSubProps>;
declare const CustomContextMenuRadioGroup: React.ForwardRefExoticComponent<ContextMenuPrimitive.ContextMenuRadioGroupProps & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuSubTrigger: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuSubTriggerProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
    value?: string;
} & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuSubContent: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuSubContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuContent: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuContentProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuItem: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuCheckboxItem: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuCheckboxItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuRadioItem: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuRadioItemProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuLabel: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuLabelProps & React.RefAttributes<HTMLDivElement>, "ref"> & {
    inset?: boolean;
} & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuSeparator: React.ForwardRefExoticComponent<Omit<ContextMenuPrimitive.ContextMenuSeparatorProps & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const CustomContextMenuShortcut: {
    ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { CustomContextMenu, CustomContextMenuTrigger, CustomContextMenuContent, CustomContextMenuItem, CustomContextMenuCheckboxItem, CustomContextMenuRadioItem, CustomContextMenuLabel, CustomContextMenuSeparator, CustomContextMenuShortcut, CustomContextMenuGroup, CustomContextMenuPortal, CustomContextMenuSub, CustomContextMenuSubContent, CustomContextMenuSubTrigger, CustomContextMenuRadioGroup, };
