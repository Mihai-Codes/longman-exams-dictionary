/**
 * Tray - system tray API
 *
 * Add icons and context menus to the system's notification area (menu bar on macOS).
 */
import { EventEmitter } from "events";
import { Menu, type MenuItemColor } from "./menu.js";
import { type NativeImage } from "./native-image.js";
import { type Point, type Rectangle } from "./screen.js";
/**
 * Tray click event with modifier keys
 */
export interface TrayClickEvent {
    altKey: boolean;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
}
/**
 * Options for Tray title (macOS only)
 */
export interface TrayTitleOptions {
    /**
     * The font type for the title
     */
    fontType?: "monospaced" | "monospacedDigit";
}
/**
 * Options for tray icons.
 */
export interface TrayIconOptions {
    /**
     * Color to tint the icon with. Accepts a named palette token
     * (e.g. `"red"`, `"green"`, `"blue"`) or a hex string (e.g. `"#FF8800"`).
     *
     * When omitted, the image is rendered as a template image so macOS can
     * adapt it to the menu bar's light/dark appearance. When provided,
     * the image is rendered in color, which is required to display SF Symbols
     * in arbitrary colors.
     */
    color?: MenuItemColor;
}
export type TrayImage = string | NativeImage;
/**
 * Events emitted by Tray
 */
export interface TrayEvents {
    click: [event: TrayClickEvent, bounds: Rectangle, position: Point];
    "right-click": [event: TrayClickEvent, bounds: Rectangle];
    "double-click": [event: TrayClickEvent, bounds: Rectangle];
    "middle-click": [event: TrayClickEvent, bounds: Rectangle];
    "mouse-enter": [event: TrayClickEvent, position: Point];
    "mouse-leave": [event: TrayClickEvent, position: Point];
    "mouse-move": [event: TrayClickEvent, position: Point];
    "mouse-down": [event: TrayClickEvent, position: Point];
    "mouse-up": [event: TrayClickEvent, position: Point];
    drop: [event: Event];
    "drop-files": [event: Event, files: string[]];
    "drop-text": [event: Event, text: string];
    "drag-enter": [event: Event];
    "drag-leave": [event: Event];
    "drag-end": [event: Event];
}
/**
 * Add icons and context menus to the system's notification area.
 *
 * On macOS the icon will be shown in the menu bar.
 *
 * @example
 * ```typescript
 * import { Tray, Menu } from '@glaze/core/backend';
 *
 * // Generate once for this app and keep the UUID unchanged across releases.
 * const tray = new Tray('/path/to/icon.png', '7a1e7125-a1d9-4c38-9c3d-1f79af1b5c6d');
 * tray.setToolTip('My Application');
 *
 * const contextMenu = Menu.buildFromTemplate([
 *   { label: 'Show', click: () => mainWindow.show() },
 *   { type: 'separator' },
 *   { label: 'Quit', role: 'quit' }
 * ]);
 * tray.setContextMenu(contextMenu);
 *
 * tray.on('click', () => {
 *   mainWindow.show();
 * });
 * ```
 */
export declare class Tray extends EventEmitter {
    private _id;
    private _guid;
    private _isDestroyed;
    private _contextMenu;
    private _menuClickHandlers;
    private _title;
    private _ignoreDoubleClickEvents;
    private _bounds;
    /**
     * Creates a new tray icon associated with the image.
     *
     * @param image - NativeImage, path to an image file, or an SF Symbol name
     *   (e.g. `"bolt.fill"`). Custom bitmaps should include enough pixels for
     *   their logical size, such as 18x18 at 1x and 36x36 at 2x. Pass the
     *   NativeImage itself rather than `toDataURL()`, which carries no scale
     *   information and therefore renders at 1x on Retina displays.
     * @param optionsOrGuid - Optional stable, app-specific GUID for retaining the
     *   menu-bar position across relaunches, or icon options like a tint color.
     *   Generate the GUID once and keep it unchanged across app releases.
     *   Without a color the image is rendered as a template so macOS tints it for the
     *   menu bar appearance; pass a color to keep the image's own colors.
     *
     * @example
     * ```ts
     * const trayGuid = "7a1e7125-a1d9-4c38-9c3d-1f79af1b5c6d";
     *
     * // Template glyph that adapts to the menu bar appearance
     * new Tray("bolt.fill", trayGuid);
     *
     * // Full-color SF Symbol
     * new Tray("bolt.fill", { guid: trayGuid, color: "#FFB020" });
     *
     * // Custom glyph with matching 1x and 2x artwork
     * const icon = nativeImage.createEmpty();
     * icon.addRepresentation({ dataURL: renderIcon(18), scaleFactor: 1 });
     * icon.addRepresentation({ dataURL: renderIcon(36), scaleFactor: 2 });
     * new Tray(icon, trayGuid);
     * ```
     */
    constructor(image: TrayImage, optionsOrGuid?: string | (TrayIconOptions & {
        guid?: string;
    }));
    private _create;
    /**
     * Destroys the tray icon immediately.
     */
    destroy(): void;
    /**
     * Returns whether the tray icon is destroyed.
     */
    isDestroyed(): boolean;
    /**
     * Sets the image associated with this tray icon.
     *
     * @param image - NativeImage, path to an image file, or an SF Symbol name. As in
     *   the constructor, pass the NativeImage rather than its data URL so its scale
     *   representations survive.
     * @param options - Optional tint color. Pass `{ color: "#FFB020" }` to render
     *   an SF Symbol in a specific color instead of as a template glyph.
     */
    setImage(image: TrayImage, options?: TrayIconOptions): void;
    /**
     * Sets the image associated with this tray icon when pressed on macOS.
     *
     * @param image - NativeImage, path to an image file, or an SF Symbol name.
     * @param options - Optional tint color, identical semantics to `setImage`.
     */
    setPressedImage(image: TrayImage, options?: TrayIconOptions): void;
    /**
     * Sets the hover text for this tray icon.
     *
     * @param toolTip - The tooltip text
     */
    setToolTip(toolTip: string): void;
    /**
     * Sets the title displayed next to the tray icon in the status bar (macOS only).
     *
     * @param title - The title text (empty string to hide)
     * @param options - Title options
     */
    setTitle(title: string, options?: TrayTitleOptions): void;
    /**
     * Returns the title displayed next to the tray icon (macOS only).
     */
    getTitle(): string;
    /** @deprecated Use `getTitle()` for the cached synchronous title. */
    getTitleAsync(): Promise<string>;
    /**
     * Sets when the tray's icon background becomes highlighted (blue) (macOS only).
     *
     * @param mode - 'selection' | 'always' | 'never'
     */
    setIgnoreDoubleClickEvents(ignore: boolean): void;
    /**
     * Returns whether double click events will be ignored (macOS only).
     */
    getIgnoreDoubleClickEvents(): boolean;
    /** @deprecated Use `getIgnoreDoubleClickEvents()` for the cached synchronous value. */
    getIgnoreDoubleClickEventsAsync(): Promise<boolean>;
    /**
     * Sets the context menu for this icon.
     *
     * @param menu - Menu to show on right-click (or null to remove)
     */
    setContextMenu(menu: Menu | null): void;
    /**
     * Register click handlers for menu items
     */
    private _registerMenuHandlers;
    /**
     * Handle menu item click from native
     */
    _handleMenuClick(commandId: number): void;
    _updateBounds(bounds: Rectangle): void;
    private _ensureAlive;
    /**
     * Pops up the context menu of the tray icon.
     * When menu is passed, the menu will be shown instead of the tray icon's context menu.
     *
     * @param menu - Optional menu to show
     * @param position - Optional position for the menu
     */
    popUpContextMenu(): void;
    popUpContextMenu(menu: Menu): void;
    popUpContextMenu(position: Point): void;
    popUpContextMenu(menu: Menu, position: Point): void;
    /**
     * Closes an open context menu.
     */
    closeContextMenu(): void;
    /**
     * Returns the bounds of this tray icon.
     */
    getBounds(): Rectangle;
    /** @deprecated Use `getBounds()` for the cached synchronous bounds. */
    getBoundsAsync(): Promise<Rectangle>;
    /**
     * The id for this tray instance
     */
    get id(): string;
    /**
     * Returns the GUID used to identify this tray icon, or null when no GUID was provided.
     */
    getGUID(): string | null;
    on<K extends keyof TrayEvents>(event: K, listener: (...args: TrayEvents[K]) => void): this;
    once<K extends keyof TrayEvents>(event: K, listener: (...args: TrayEvents[K]) => void): this;
    off<K extends keyof TrayEvents>(event: K, listener: (...args: TrayEvents[K]) => void): this;
    emit<K extends keyof TrayEvents>(event: K, ...args: TrayEvents[K]): boolean;
    removeListener<K extends keyof TrayEvents>(event: K, listener: (...args: TrayEvents[K]) => void): this;
}
