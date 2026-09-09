import * as React from "react";
import { type NativeMenuItem, type NativeMenuIcon } from "../utils/native-menu-helpers";
export type DropdownMenuSide = "top" | "bottom";
export type DropdownMenuAlign = "start" | "center" | "end";
export interface UseNativeDropdownMenuOptions {
    items: NativeMenuItem[];
    /** Element whose bounds position the menu. Falls back to the trigger when omitted or unavailable. */
    anchorRef?: React.RefObject<HTMLElement | null>;
    disabled?: boolean;
    side?: DropdownMenuSide;
    align?: DropdownMenuAlign;
    sideOffset?: number;
    alignOffset?: number;
    onClose?: () => void;
    onOpen?: () => void;
}
export interface UseNativeDropdownMenuReturn {
    triggerProps: {
        onMouseDown: (event: React.MouseEvent) => void;
        onClick: (event: React.MouseEvent) => void;
        onKeyDown: (event: React.KeyboardEvent) => void;
        role: "button";
        "aria-haspopup": "menu";
        "aria-expanded": boolean;
        "aria-disabled": boolean | undefined;
        tabIndex: number;
    };
    isOpen: boolean;
    triggerRef: React.RefObject<HTMLElement | null>;
    openMenu: (position?: {
        x: number;
        y: number;
    }) => Promise<void>;
    openMenuAtTrigger: (clickEvent?: React.MouseEvent) => Promise<void>;
}
export declare function useNativeDropdownMenu(options: UseNativeDropdownMenuOptions): UseNativeDropdownMenuReturn;
export type { NativeMenuItem, NativeMenuIcon };
