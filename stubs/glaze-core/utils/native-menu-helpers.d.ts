/**
 * Native Menu Helpers
 *
 * Helper utilities for building native menu items from React-style configurations.
 */
import { type MenuItemConstructorOptions, type PopupOptions, type PopupResult } from "./menu";
import { type MenuItemColor } from "../backend/menu.js";
import { type SFSymbol } from "sf-symbols-typescript";
/**
 * Icon type for native menu items.
 * - `SFSymbol`: SF Symbol name with full autocomplete (e.g., "star.fill", "folder", "trash")
 * - `{ sfSymbol: SFSymbol }`: Explicit SF Symbol object form
 * - `{ imagePath: string; isTemplate?: boolean }`: Path to an image file, optionally as a template image
 *   - Template images are monochrome and adapt to light/dark mode
 *   - Non-template images (default) render with their original colors
 */
export type NativeMenuIcon = SFSymbol | {
    sfSymbol: SFSymbol;
} | {
    imagePath: string;
    isTemplate?: boolean;
};
interface NativeMenuItemBase {
    label?: string;
    sublabel?: string;
    icon?: NativeMenuIcon;
    accelerator?: string;
    enabled?: boolean;
    color?: MenuItemColor;
    iconColor?: MenuItemColor;
    id?: string;
}
export interface NativeMenuItemNormal extends NativeMenuItemBase {
    type?: "normal";
    onSelect?: () => void;
}
export interface NativeMenuItemSeparator {
    type: "separator";
}
export interface NativeMenuItemCheckbox extends NativeMenuItemBase {
    type: "checkbox";
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}
export interface NativeMenuItemSubmenu extends NativeMenuItemBase {
    type: "submenu";
    submenu: NativeMenuItem[];
}
export interface NativeMenuItemGroup extends NativeMenuItemBase {
    type: "group";
    items: NativeMenuItem[];
}
export type NativeMenuItem = NativeMenuItemNormal | NativeMenuItemSeparator | NativeMenuItemCheckbox | NativeMenuItemSubmenu | NativeMenuItemGroup;
interface CallbackEntry {
    onSelect?: () => void;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    type: NativeMenuItem["type"];
}
export interface ResolvedIcon {
    path: string;
    isTemplate: boolean;
}
export declare function resolveIcon(icon: NativeMenuIcon | undefined): ResolvedIcon | undefined;
export declare function buildNativeMenuItems(items: NativeMenuItem[], startCommandId?: number): {
    nativeItems: MenuItemConstructorOptions[];
    callbacks: Map<number, CallbackEntry>;
    nextCommandId: number;
};
export declare function handleMenuResult(result: PopupResult, callbacks: Map<number, CallbackEntry>): void;
export declare function showNativeMenu(items: NativeMenuItem[], options?: {
    x?: number;
    y?: number;
    positioningItem?: number;
}): Promise<PopupResult>;
export declare function showNativeViewMenu(items: NativeMenuItem[], options?: {
    x?: number;
    y?: number;
    positioningItem?: number;
}): Promise<PopupResult>;
export declare function popupNativeViewMenu(options: PopupOptions): Promise<PopupResult>;
export declare function getScreenPosition(event: {
    screenX: number;
    screenY: number;
}): {
    x: number;
    y: number;
};
export declare function getElementScreenPosition(element: HTMLElement, options?: {
    anchor?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right";
}): {
    x: number;
    y: number;
};
export {};
