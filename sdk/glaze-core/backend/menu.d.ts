/**
 * Menu and MenuItem - menu API
 *
 * This module provides application menu and context menu functionality
 * that mirrors the Menu and MenuItem APIs.
 */
import { EventEmitter } from "events";
import { BrowserWindow } from "./browser-window.js";
import { type NativeImage } from "./native-image.js";
import { type WebFrameMain } from "./web-frame-main.js";
import { WebContents } from "./web-contents.js";
/**
 * Supported menu item roles with predefined behaviors
 */
export type MenuItemRole = "undo" | "redo" | "cut" | "copy" | "paste" | "pasteAndMatchStyle" | "delete" | "selectAll" | "reload" | "forceReload" | "toggleDevTools" | "resetZoom" | "zoomIn" | "zoomOut" | "toggleSpellChecker" | "togglefullscreen" | "window" | "minimize" | "close" | "help" | "about" | "services" | "hide" | "hideOthers" | "unhide" | "quit" | "showSubstitutions" | "toggleSmartQuotes" | "toggleSmartDashes" | "toggleTextReplacement" | "startSpeaking" | "stopSpeaking" | "appMenu" | "fileMenu" | "editMenu" | "viewMenu" | "windowMenu" | "shareMenu" | "recentDocuments" | "toggleTabBar" | "selectNextTab" | "selectPreviousTab" | "showAllTabs" | "mergeAllWindows" | "moveTabToNewWindow" | "clearRecentDocuments" | "front" | "zoom";
/**
 * Menu item types
 */
export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio" | "header" | "palette";
export type MenuItemClickEvent = KeyboardEvent & {
    triggeredByAccelerator: boolean;
};
export type MenuItemConstructorClick = (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: MenuItemClickEvent) => void;
export interface MenuItemClick {
    (event: MenuItemClickEvent, focusedWindow?: BrowserWindow, focusedWebContents?: WebContents): void;
    (menuItem: MenuItem, browserWindow: BrowserWindow | undefined, event: MenuItemClickEvent): void;
}
export interface SharingItem {
    texts?: string[];
    filePaths?: string[];
    urls?: string[];
}
export type MenuItemIcon = string | NativeImage;
export type MenuPopupSourceType = "none" | "mouse" | "keyboard" | "touch" | "touchMenu" | "longPress" | "longTap" | "touchHandle" | "stylus" | "adjustSelection" | "adjustSelectionReset";
/**
 * Colors for menu item label and icon.
 */
/**
 * Color for menu item labels and icons.
 *
 * Accepts one of the named palette tokens that map to macOS system colors,
 * or any hex string (`#RGB`, `#RRGGBB`, or `#RRGGBBAA`, with or without `#`).
 *
 * Use a named token when you want the color to adapt to light/dark mode and
 * accessibility settings. Use a hex string when you need an exact brand color.
 */
export type MenuItemColor = "red" | "orange" | "yellow" | "green" | "mint" | "teal" | "cyan" | "blue" | "indigo" | "purple" | "pink" | "brown" | "gray" | "primary" | "secondary" | (string & {});
/**
 * Options for constructing a MenuItem
 */
export interface MenuItemConstructorOptions {
    /**
     * Will be called with click(menuItem, browserWindow, event) when the menu item is clicked.
     */
    click?: MenuItemConstructorClick;
    /**
     * Predefined action of the menu item.
     * When specified, the click property will be ignored.
     */
    role?: MenuItemRole;
    /**
     * Can be normal, separator, submenu, checkbox, radio, header or palette.
     */
    type?: MenuItemType;
    /**
     * The text label of the menu item.
     */
    label?: string;
    /**
     * Secondary text displayed below the label (macOS 14.4+)
     */
    sublabel?: string;
    /**
     * Hover text for this menu item (macOS only)
     */
    toolTip?: string;
    /**
     * Icon for the menu item (NativeImage, SF Symbol name, or file path)
     */
    icon?: MenuItemIcon;
    /**
     * If true, the icon will be rendered as a template image (macOS).
     * Template images automatically adapt to the current appearance (light/dark mode).
     * Only applies to custom images (file paths), not SF Symbols.
     */
    iconIsTemplate?: boolean;
    /**
     * Keyboard shortcut string (e.g., "CommandOrControl+C")
     */
    accelerator?: string;
    /**
     * If false, the menu item will be greyed out and unclickable.
     */
    enabled?: boolean;
    /**
     * If false, the accelerator will not trigger when the item is hidden.
     */
    acceleratorWorksWhenHidden?: boolean;
    /**
     * If false, the menu item will be entirely hidden.
     */
    visible?: boolean;
    /**
     * Should only be specified for checkbox or radio type menu items.
     */
    checked?: boolean;
    /**
     * If false, the accelerator won't be registered with the system.
     */
    registerAccelerator?: boolean;
    /**
     * Should be specified for submenu type menu items.
     * If submenu is specified, the type: 'submenu' can be omitted.
     */
    submenu?: MenuItemConstructorOptions[] | Menu;
    /**
     * Item to share when role is "shareMenu".
     */
    sharingItem?: SharingItem;
    /**
     * Unique within a single menu.
     */
    id?: string;
    /**
     * Inserts this item before the item with the specified id.
     */
    before?: string[];
    /**
     * Inserts this item after the item with the specified id.
     */
    after?: string[];
    /**
     * Places this item's containing group before the group containing the specified id.
     */
    beforeGroupContaining?: string[];
    /**
     * Places this item's containing group after the group containing the specified id.
     */
    afterGroupContaining?: string[];
    /**
     * Unique command ID for the menu item.
     * If not provided, an auto-incremented ID will be assigned.
     */
    commandId?: number;
    /**
     * Color for the menu item label. Accepts a named palette token
     * (e.g. `"red"`, `"green"`, `"blue"`) or a hex string (e.g. `"#FF8800"`).
     * When set, the icon is recolored to match unless `iconColor` is provided.
     */
    color?: MenuItemColor;
    /**
     * Color for the menu item icon only. Lets you tint the icon independently
     * of the label (e.g. a colored glyph next to default-colored text).
     * Accepts the same values as `color`. Falls back to `color` when omitted.
     */
    iconColor?: MenuItemColor;
}
/**
 * Options for popup menu
 */
export interface PopupOptions {
    /**
     * The window to show the context menu on (defaults to focused window)
     */
    window?: unknown;
    /**
     * The frame associated with the context menu request.
     */
    frame?: WebFrameMain;
    /**
     * The screen-space x coordinate for the menu position
     */
    x?: number;
    /**
     * The screen-space y coordinate for the menu position (top-left origin)
     */
    y?: number;
    /**
     * The index of the menu item to be positioned under the mouse cursor
     */
    positioningItem?: number;
    /**
     * Source type for context menu requests on Windows and Linux.
     */
    sourceType?: MenuPopupSourceType;
    /**
     * Minimum width of the menu (useful for select-style menus)
     */
    minWidth?: number;
    /**
     * Called when menu is closed
     */
    callback?: () => void;
}
export interface PopupReturnValue {
    browserWindow: BrowserWindow;
    x: number;
    y: number;
    position: number;
}
type MenuItemStateChangeOptions = {
    notify?: boolean;
};
type MenuTemplatePlacement = Pick<MenuItemConstructorOptions, "before" | "after" | "beforeGroupContaining" | "afterGroupContaining">;
/**
 * Add items to native application menus and context menus.
 */
export declare class MenuItem {
    private _id;
    private _label;
    private _sublabel;
    private _toolTip;
    private _icon;
    private _iconIsTemplate;
    private _accelerator;
    private _enabled;
    private _acceleratorWorksWhenHidden;
    private _visible;
    private _checked;
    private _type;
    private _role;
    private _click;
    private _constructorClick;
    private _submenu;
    private _sharingItem;
    private _commandId;
    private _registerAccelerator;
    private _color;
    private _iconColor;
    private _before;
    private _after;
    private _beforeGroupContaining;
    private _afterGroupContaining;
    private _menu;
    private _radioGroupId;
    private _registerAcceleratorExplicit;
    private _typeExplicit;
    constructor(options: MenuItemConstructorOptions);
    /**
     * Apply default label and accelerator based on role
     */
    private _applyRoleDefaults;
    private _setClick;
    private _notifyMenuItemChanged;
    get id(): string;
    get label(): string;
    get sublabel(): string;
    get toolTip(): string;
    get icon(): MenuItemIcon | undefined;
    get accelerator(): string | undefined;
    get enabled(): boolean;
    get acceleratorWorksWhenHidden(): boolean;
    get visible(): boolean;
    get checked(): boolean;
    get type(): MenuItemType;
    get role(): MenuItemRole | undefined;
    get click(): MenuItemClick;
    get submenu(): Menu | undefined;
    get sharingItem(): SharingItem | undefined;
    get userAccelerator(): string | null;
    get commandId(): number;
    get registerAccelerator(): boolean;
    get menu(): Menu | undefined;
    set enabled(value: boolean);
    set acceleratorWorksWhenHidden(value: boolean);
    set visible(value: boolean);
    set checked(value: boolean);
    set id(value: string);
    set label(value: string);
    set sublabel(value: string);
    set toolTip(value: string);
    set icon(value: MenuItemIcon | undefined);
    set accelerator(value: string | undefined);
    set click(value: MenuItemClick);
    set registerAccelerator(value: boolean);
    set sharingItem(value: SharingItem | undefined);
    /**
     * Set the parent menu (internal use)
     */
    _setMenu(menu: Menu | undefined): void;
    /** @internal */
    _setRadioGroupId(groupId: number | undefined): void;
    /** @internal */
    _setCheckedFromMenu(checked: boolean, options?: MenuItemStateChangeOptions): void;
    /** @internal */
    _applyClickStateChange(): void;
    /** @internal */
    _getPlacement(): MenuTemplatePlacement;
    /**
     * Convert to serializable object for native bridge
     */
    toJSON(options?: MenuSerializationOptions): Record<string, unknown>;
}
interface MenuSerializationOptions {
    includeHidden?: boolean;
    installedApplicationMenuSnapshot?: boolean;
}
/**
 * Create native application menus and context menus.
 */
export declare class Menu extends EventEmitter {
    private _items;
    private _popupOpen;
    private _ownedCommandIds;
    private _ownedMenuItems;
    private _radioGroups;
    private static _applicationMenu;
    private static _applicationMenuWasSet;
    private static _installedApplicationMenuItems;
    private static _installedApplicationMenuItemOrder;
    constructor();
    /**
     * The items in this menu
     */
    get items(): MenuItem[];
    /**
     * Appends the menuItem to the menu.
     */
    append(menuItem: MenuItem): void;
    /**
     * Inserts the menuItem to the pos position of the menu.
     */
    insert(pos: number, menuItem: MenuItem): void;
    /**
     * Finds the first menu item with matching id
     */
    getMenuItemById(id: string): MenuItem | null;
    /**
     * Register handlers for all items in a submenu
     */
    private _registerSubmenuHandlers;
    /** @internal */
    _setRadioItemChecked(menuItem: MenuItem): void;
    private _findRadioGroupForItem;
    private _refreshRadioGroups;
    private _ensureRadioGroupSelection;
    /**
     * Pops up this menu as a context menu.
     *
     * Follows the pattern where menu item clicks are handled via the
     * click callback on each MenuItem.
     */
    popup(options?: PopupOptions & {
        coordinateSpace?: "screen" | "view";
    }): PopupReturnValue;
    /**
     * @deprecated Use `popup()` and item click callbacks for Electron-compatible behavior.
     * This preserves Glaze's old commandId result for renderer use cases where callbacks
     * cannot cross the IPC boundary.
     */
    popupWithResult(options?: PopupOptions & {
        coordinateSpace?: "screen" | "view";
    }): Promise<{
        commandId?: number;
    }>;
    /**
     * Closes the context menu
     */
    closePopup(window?: unknown): void;
    private _emitMenuWillShow;
    private _emitMenuWillClose;
    /**
     * Convert to serializable array for native bridge
     */
    toJSON(options?: MenuSerializationOptions): Record<string, unknown>[];
    /**
     * Sets menu as the application menu on macOS.
     */
    static setApplicationMenu(menu: Menu | null): void;
    /**
     * Returns the application menu if set, or null.
     */
    static getApplicationMenu(): Menu | null;
    /** @internal */
    static _refreshApplicationMenuForItem(menuItem: MenuItem): void;
    /** @internal */
    static _setDefaultApplicationMenuIfNeeded(): void;
    /** @internal */
    static _resetApplicationMenuForTests(): void;
    private static _installApplicationMenu;
    private static _captureInstalledApplicationMenuSnapshot;
    private static _clearInstalledApplicationMenuSnapshot;
    /**
     * Sends the action to the first responder of application.
     * This is used for emulating default macOS menu behaviors.
     * macOS only.
     */
    static sendActionToFirstResponder(action: string): void;
    /**
     * Build a menu from a template array
     */
    static buildFromTemplate(template: (MenuItemConstructorOptions | MenuItem)[]): Menu;
    private static _buildRoleMenuItem;
    private static _buildRoleMenu;
}
/**
 * Called by native code when a menu item is clicked
 */
export declare function handleMenuItemClick(commandId: number, event?: unknown): void;
/**
 * Loads the persisted agent button visibility from native storage.
 * Call before Menu.buildFromTemplate() so the viewMenu checkbox reflects the saved state.
 */
export declare function initDevToolsButtonState(): Promise<void>;
export {};
