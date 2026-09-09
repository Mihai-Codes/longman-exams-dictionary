/**
 * Menu API - calls window.glazeAPI.Menu
 */
import { type MenuItemColor } from "../backend/menu.js";
/**
 * Geometry types
 */
export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Menu item types
 */
export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio" | "header" | "palette";
export interface SharingItem {
    texts?: string[];
    filePaths?: string[];
    urls?: string[];
}
/**
 * Standard menu item roles
 */
export type MenuItemRole = "undo" | "redo" | "cut" | "copy" | "paste" | "pasteAndMatchStyle" | "delete" | "selectAll" | "reload" | "forceReload" | "toggleDevTools" | "resetZoom" | "zoomIn" | "zoomOut" | "toggleSpellChecker" | "togglefullscreen" | "window" | "minimize" | "close" | "help" | "about" | "services" | "hide" | "hideOthers" | "unhide" | "quit" | "showSubstitutions" | "toggleSmartQuotes" | "toggleSmartDashes" | "toggleTextReplacement" | "startSpeaking" | "stopSpeaking" | "zoom" | "front" | "appMenu" | "fileMenu" | "editMenu" | "viewMenu" | "shareMenu" | "recentDocuments" | "toggleTabBar" | "selectNextTab" | "selectPreviousTab" | "showAllTabs" | "mergeAllWindows" | "clearRecentDocuments" | "moveTabToNewWindow" | "windowMenu";
/**
 * Menu item constructor options
 */
export interface MenuItemConstructorOptions {
    type?: MenuItemType;
    label?: string;
    sublabel?: string;
    toolTip?: string;
    accelerator?: string;
    icon?: string;
    /** Whether the icon should be treated as a template image (adapts to light/dark mode). Defaults to false for file paths, always true for SF Symbols. */
    iconIsTemplate?: boolean;
    enabled?: boolean;
    acceleratorWorksWhenHidden?: boolean;
    visible?: boolean;
    checked?: boolean;
    registerAccelerator?: boolean;
    submenu?: MenuItemConstructorOptions[];
    sharingItem?: SharingItem;
    id?: string;
    before?: string[];
    after?: string[];
    beforeGroupContaining?: string[];
    afterGroupContaining?: string[];
    role?: MenuItemRole;
    commandId?: number;
    /** Color for the menu item label (and icon, unless `iconColor` overrides). */
    color?: MenuItemColor;
    /** Color for the menu item icon only. Falls back to `color` when omitted. */
    iconColor?: MenuItemColor;
}
export interface PopupOptions {
    items: MenuItemConstructorOptions[];
    x?: number;
    y?: number;
    positioningItem?: number;
    minWidth?: number;
}
export interface PopupResult {
    commandId?: number;
}
declare function popup(options: PopupOptions): Promise<PopupResult>;
declare function setApplicationMenu(template: MenuItemConstructorOptions[] | null): Promise<void>;
export declare const menu: {
    popup: typeof popup;
    setApplicationMenu: typeof setApplicationMenu;
};
export {};
