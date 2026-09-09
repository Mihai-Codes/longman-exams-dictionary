/**
 * BrowserWindow - window management API
 *
 * Allows creating and managing native windows from the Node.js backend.
 * Matches the BrowserWindow API for familiarity.
 */
import { EventEmitter } from "events";
import { type LoadFileOptions } from "./load-file-options.js";
import { type LoadURLOptions } from "./load-url-options.js";
import { type NativeImage } from "./native-image.js";
import { type Rectangle } from "./screen.js";
import { Session } from "./session.js";
import { WebContents, type WebContentsCapturePageOptions, type WebContentsImageAnimationPolicy, type WebContentsOpenDevToolsOptions, type WebContentsWindowOpenDetails } from "./web-contents.js";
export type { LoadFileOptions } from "./load-file-options.js";
/**
 * Window bounds (position and size)
 */
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export type BrowserWindowAnimationBehavior = "default" | "none" | "documentWindow" | "utilityWindow" | "alertPanel";
export type BrowserWindowAutoplayPolicy = "no-user-gesture-required" | "user-gesture-required" | "document-user-activation-required";
export type BrowserWindowVisualEffectState = "followWindow" | "active" | "inactive";
export type BrowserWindowTitleBarStyle = "default" | "hidden" | "hiddenInset" | "customButtonsOnHover";
export type BrowserWindowType = "desktop" | "panel";
export type BrowserWindowVibrancy = "titlebar" | "selection" | "menu" | "popover" | "sidebar" | "header" | "sheet" | "window" | "hud" | "fullscreen-ui" | "tooltip" | "content" | "under-window" | "under-page";
export type BrowserWindowGlazeBackgroundMaterial = "auto" | "none" | "mica" | "acrylic" | "tabbed";
export type BrowserWindowResizeEdge = "bottom" | "top" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
export interface BrowserWindowWillResizeDetails {
    edge: BrowserWindowResizeEdge;
}
/**
 * Window lifecycle events
 */
export interface BrowserWindowEvents {
    "ready-to-show": (event: BrowserWindowEvent) => void;
    show: (event: BrowserWindowEvent) => void;
    hide: (event: BrowserWindowEvent) => void;
    close: (event: BrowserWindowEvent) => void;
    closed: (event: BrowserWindowEvent) => void;
    focus: (event: BrowserWindowEvent) => void;
    blur: (event: BrowserWindowEvent) => void;
    unresponsive: () => void;
    responsive: () => void;
    minimize: (event: BrowserWindowEvent) => void;
    maximize: (event: BrowserWindowEvent) => void;
    unmaximize: (event: BrowserWindowEvent) => void;
    restore: (event: BrowserWindowEvent) => void;
    resize: (event: BrowserWindowEvent) => void;
    resized: (event: BrowserWindowEvent) => void;
    "will-resize": (event: BrowserWindowEvent, newBounds: Bounds, details: BrowserWindowWillResizeDetails) => void;
    move: (event: BrowserWindowEvent) => void;
    moved: (event: BrowserWindowEvent) => void;
    "will-move": (event: BrowserWindowEvent, newBounds: Bounds) => void;
    "enter-full-screen": (event: BrowserWindowEvent) => void;
    "leave-full-screen": (event: BrowserWindowEvent) => void;
    "enter-html-full-screen": (event: BrowserWindowEvent) => void;
    "leave-html-full-screen": (event: BrowserWindowEvent) => void;
    "always-on-top-changed": (event: BrowserWindowEvent, isAlwaysOnTop: boolean) => void;
    "page-title-updated": (event: BrowserWindowEvent, title: string, explicitSet: boolean) => void;
    swipe: (event: BrowserWindowEvent, direction: "up" | "right" | "down" | "left") => void;
    "rotate-gesture": (event: BrowserWindowEvent, rotation: number) => void;
    "sheet-begin": (event: BrowserWindowEvent) => void;
    "sheet-end": (event: BrowserWindowEvent) => void;
    "new-window-for-tab": (event: BrowserWindowEvent) => void;
}
/**
 * Options for creating a new BrowserWindow
 */
export interface BrowserWindowConstructorOptions {
    /**
     * Stable window key for frame persistence. If not provided, an internal key will be generated.
     */
    windowKey?: string;
    /**
     * @deprecated Use windowKey instead. This remains supported for migration.
     * Use a stable ID (e.g., "main") for windows that should remember their position across launches.
     */
    id?: string;
    /**
     * Window width in pixels. Default: 800
     */
    width?: number;
    /**
     * Window height in pixels. Default: 600
     */
    height?: number;
    /**
     * Treat width and height as the web page/content size instead of the full native window frame size.
     */
    useContentSize?: boolean;
    /**
     * Window's left offset from screen
     */
    x?: number;
    /**
     * Window's top offset from screen
     */
    y?: number;
    /**
     * Minimum window width. Default: no minimum
     */
    minWidth?: number;
    /**
     * Minimum window height. Default: no minimum
     */
    minHeight?: number;
    /**
     * Maximum window width. Default: no maximum
     */
    maxWidth?: number;
    /**
     * Maximum window height. Default: no maximum
     */
    maxHeight?: number;
    /**
     * Whether window is resizable. Default: true
     */
    resizable?: boolean;
    /**
     * Whether window is movable. Default: true
     */
    movable?: boolean;
    /**
     * Whether window is minimizable. Default: true
     */
    minimizable?: boolean;
    /**
     * Whether window is maximizable. Default: true
     */
    maximizable?: boolean;
    /**
     * Whether window is closable. Default: true
     */
    closable?: boolean;
    /**
     * Whether window should always stay on top. Default: false
     */
    alwaysOnTop?: boolean;
    /**
     * Whether window is fullscreenable. Default: true
     */
    fullscreenable?: boolean;
    /**
     * Whether the window can be resized larger than the screen. macOS only. Default: false
     */
    enableLargerThanScreen?: boolean;
    /**
     * Window title
     */
    title?: string;
    /**
     * Whether to show window when created. Default: true
     */
    show?: boolean;
    /**
     * Whether to center the window. Default: false
     */
    center?: boolean;
    /**
     * Background color of the window (hex format). Default: '#FFFFFF'
     */
    backgroundColor?: string;
    /**
     * Whether the native window should use the standard frame. Default: true.
     * Set to false for frameless windows.
     */
    frame?: boolean;
    /**
     * Whether a frameless window should use rounded system corners. macOS only. Default: true
     */
    roundedCorners?: boolean;
    /**
     * Parent window for native parent-child presentation.
     */
    parent?: BrowserWindow;
    /**
     * Whether this window should behave as a modal child of its parent. Requires parent.
     */
    modal?: boolean;
    /**
     * Whether the native window should be fully transparent. Default: false.
     * Creates a fully transparent native window.
     */
    transparent?: boolean;
    /**
     * macOS native window type. Deprecated window types are intentionally omitted.
     */
    type?: BrowserWindowType;
    /**
     * Window opacity (0.0 - 1.0). Default: 1.0
     */
    opacity?: number;
    /**
     * macOS toolbar style. Options: "none", "unified", "unifiedCompact". Default: "unified"
     */
    toolbarStyle?: "none" | "unified" | "unifiedCompact";
    /**
     * macOS title bar style. When set, the default toolbar style changes to "none".
     */
    titleBarStyle?: BrowserWindowTitleBarStyle;
    /**
     * Whether the window should be in fullscreen mode. Default: false
     */
    fullscreen?: boolean;
    /**
     * Whether window is focusable. Default: true
     */
    focusable?: boolean;
    /**
     * Whether window should be hidden in Mission Control. Default: false
     */
    hiddenInMissionControl?: boolean;
    /**
     * Whether window should be visible on all workspaces. Default: false
     */
    visibleOnAllWorkspaces?: boolean;
    /**
     * Whether the first mouse click should be accepted when the window is inactive. macOS only.
     * Allows the initial click to reach interactive content instead of only activating the window. Default: false.
     */
    acceptFirstMouse?: boolean;
    /**
     * @deprecated Use Electron-compatible `acceptFirstMouse` instead.
     */
    acceptsFirstMouse?: boolean;
    /**
     * macOS native tab group name. Windows with the same identifier can be grouped as tabs.
     */
    tabbingIdentifier?: string;
    /**
     * Whether window should skip the dock/taskbar. Default: false
     */
    skipTaskbar?: boolean;
    /**
     * Whether window should have a shadow. Default: true
     */
    hasShadow?: boolean;
    /**
     * Whether to disable hiding the cursor while typing. Default: false
     */
    disableAutoHideCursor?: boolean;
    /**
     * Whether window should use simple fullscreen. Default: false
     */
    simpleFullscreen?: boolean;
    /**
     * Whether window should start in kiosk mode. Default: false
     */
    kiosk?: boolean;
    /**
     * macOS custom traffic light button position for framed windows that keep native window buttons.
     */
    trafficLightPosition?: {
        x: number;
        y: number;
    };
    /**
     * @deprecated Use `trafficLightPosition` instead.
     */
    windowButtonPosition?: {
        x: number;
        y: number;
    };
    /**
     * macOS vibrancy using supported NSVisualEffectView materials.
     * Deprecated AppKit materials such as "light" and "dark" are intentionally omitted.
     */
    vibrancy?: BrowserWindowVibrancy | null;
    /**
     * How a vibrancy material reflects the window's activity state. Default: "followWindow"
     */
    visualEffectState?: BrowserWindowVisualEffectState;
    /**
     * macOS window animation behavior. Controls show/hide animation style.
     */
    animationBehavior?: BrowserWindowAnimationBehavior;
    /**
     * Whether macOS Zoom/maximize should size the window to the page's preferred width. Default: false
     */
    zoomToPageWidth?: boolean;
    /**
     * Whether hidden windows should paint initially and emit ready-to-show. Default: true
     */
    paintWhenInitiallyHidden?: boolean;
    /**
     * Web preferences for the window's web contents.
     */
    webPreferences?: {
        /** Whether to enable content JavaScript. Defaults to true. */
        javascript?: boolean;
        /** Whether textarea elements can be resized by the user. Defaults to true. */
        textAreasAreResizable?: boolean;
        /** Policy for animated images. Defaults to "animate". */
        imageAnimationPolicy?: WebContentsImageAnimationPolicy;
        /** Minimum font size for web content. Defaults to 0. */
        minimumFontSize?: number;
        /** Autoplay policy for media content. Defaults to "no-user-gesture-required". */
        autoplayPolicy?: BrowserWindowAutoplayPolicy;
        /** Whether web content should render with a transparent background. */
        transparent?: boolean;
        /** Whether JavaScript dialogs should be disabled. Defaults to false. */
        disableDialogs?: boolean;
        /** Whether to enable browser-style consecutive dialog protection. Defaults to false. */
        safeDialogs?: boolean;
        /** Message to display when consecutive dialog protection is triggered. */
        safeDialogsMessage?: string;
        /** Whether dropping a file or link onto the page should navigate. Defaults to false. */
        navigateOnDragDrop?: boolean;
        /** Whether to prevent the native window from resizing when entering HTML fullscreen. Defaults to false. */
        disableHtmlFullscreenWindowResize?: boolean;
        /** Whether to enable spellchecking in editable web content. Defaults to true. */
        spellcheck?: boolean;
        /** Whether the web contents should be focused when navigating. Defaults to true. */
        focusOnNavigation?: boolean;
        /** Whether DevTools can be opened for this window. Defaults to true. */
        devTools?: boolean;
        /**
         * Custom user agent string for this window.
         */
        userAgent?: string;
        /** Initial page zoom factor. Defaults to 1.0. */
        zoomFactor?: number;
        /** Whether to emit preferred-size-changed when the page's preferred size changes. Defaults to false. */
        enablePreferredSizeMode?: boolean;
        /** Absolute path to preload script. Injected by runtime before page scripts. */
        preload?: string;
        /**
         * Whether the preload script and IPC bridge are also injected into
         * SAME-ORIGIN child frames (iframes), giving them live IPC with frame
         * sender attribution. Cross-origin frames always stay bridge-less.
         * Defaults to false (main frame only).
         */
        nodeIntegrationInSubFrames?: boolean;
        /** Session partition. "persist:*" partitions are persistent. */
        partition?: string;
        /** Session object. Takes precedence over partition. */
        session?: Session;
        /** Whether to enable session cache. Defaults to true. */
        cache?: boolean;
        /** Whether this WebContents may throttle timers and animations when backgrounded. Defaults to true. */
        backgroundThrottling?: boolean;
        /** Alternative title exposed only to accessibility tools. */
        accessibleTitle?: string;
    };
}
type BrowserWindowOwnerResolvable = {
    _getOwner?: () => BrowserWindow | null;
    id?: string | number;
    windowId?: string | number;
};
export declare class BrowserWindowEvent {
    readonly type: keyof BrowserWindowEvents;
    readonly sender: BrowserWindow;
    defaultPrevented: boolean;
    constructor(type: keyof BrowserWindowEvents, sender: BrowserWindow);
    preventDefault(): void;
}
type BrowserWindowNoArgsEvent = "unresponsive" | "responsive";
type LegacyBrowserWindowEventObjectListener = (event: BrowserWindowEvent) => void;
type BrowserWindowNativeEventParams = Partial<Bounds> & {
    contentX?: number;
    contentY?: number;
    contentWidth?: number;
    contentHeight?: number;
    normalX?: number;
    normalY?: number;
    normalWidth?: number;
    normalHeight?: number;
    isAlwaysOnTop?: boolean;
    title?: string;
    explicitSet?: boolean;
    direction?: "up" | "right" | "down" | "left";
    rotation?: number;
    edge?: BrowserWindowResizeEdge;
    occluded?: boolean;
};
type BrowserWindowAppEventMap = {
    "browser-window-created": (window: BrowserWindow) => void;
    "browser-window-focus": (window: BrowserWindow) => void;
    "browser-window-blur": (window: BrowserWindow) => void;
    "new-window-for-tab": () => void;
    "web-contents-created": (webContents: WebContents) => void;
    "window-all-closed": () => void;
};
/**
 * BrowserWindow - Create and control native windows
 *
 * Matches the BrowserWindow API
 *
 * @example
 * ```typescript
 * const { BrowserWindow } = require('@glaze/core/backend');
 *
 * const win = new BrowserWindow({ width: 800, height: 600 });
 *
 * win.on('ready-to-show', () => {
 *   win.show();
 * });
 *
 * win.on('close', () => {
 *   console.log('Window closing');
 * });
 *
 * await win.loadURL('http://localhost:4143');
 * ```
 */
export declare class BrowserWindow extends EventEmitter {
    private readonly _id;
    private readonly _runtimeId;
    private readonly _windowKey;
    private _parentWindow;
    private readonly _childWindows;
    private readonly _modalConfigured;
    private readonly _shouldEmitReadyToShow;
    private _url;
    private _isDestroyed;
    private _state;
    private _closeCascadePromise;
    private _destroyPromise;
    private readonly _noArgsListenerAdapters;
    private _pendingLoad;
    private _pendingLoadStopTimer;
    private _nextPendingLoadId;
    private readonly _webContents;
    /**
     * Returns an array of all opened browser windows
     */
    static getAllWindows(): BrowserWindow[];
    /** @internal */
    static _requestCloseAllForAppQuit(): Promise<boolean>;
    /**
     * Returns the window that is focused, otherwise returns null
     */
    static getFocusedWindow(): BrowserWindow | null;
    /**
     * Returns the last BrowserWindow that had focus, even if a non-Glaze window
     * such as detached DevTools is currently key.
     */
    static getLastFocusedWindow(): BrowserWindow | null;
    /**
     * Returns the window with the given id
     */
    static fromId(id: number | string): BrowserWindow | null;
    static fromWebContents(webContents: WebContents | BrowserWindowOwnerResolvable | null | undefined): BrowserWindow | null;
    /** @internal */
    static _fromNativeId(id: string): BrowserWindow | null;
    /** @internal */
    static _onAppEvent<K extends keyof BrowserWindowAppEventMap>(eventName: K, listener: BrowserWindowAppEventMap[K]): () => void;
    /**
     * Create a new BrowserWindow
     */
    constructor(options?: BrowserWindowConstructorOptions);
    /**
     * Get the unique ID of this window
     */
    get id(): number;
    get tabbingIdentifier(): string | undefined;
    get webContents(): WebContents;
    get windowKey(): string | null;
    get title(): string;
    set title(value: string);
    get accessibleTitle(): string;
    set accessibleTitle(value: string);
    get fullScreen(): boolean;
    set fullScreen(value: boolean);
    get fullScreenable(): boolean;
    set fullScreenable(value: boolean);
    get resizable(): boolean;
    set resizable(value: boolean);
    get movable(): boolean;
    set movable(value: boolean);
    get minimizable(): boolean;
    set minimizable(value: boolean);
    get maximizable(): boolean;
    set maximizable(value: boolean);
    get closable(): boolean;
    set closable(value: boolean);
    get alwaysOnTop(): boolean;
    set alwaysOnTop(value: boolean);
    get animationBehavior(): BrowserWindowAnimationBehavior;
    set animationBehavior(value: BrowserWindowAnimationBehavior);
    get focusable(): boolean;
    set focusable(value: boolean);
    get visibleOnAllWorkspaces(): boolean;
    set visibleOnAllWorkspaces(value: boolean);
    get excludedFromShownWindowsMenu(): boolean;
    set excludedFromShownWindowsMenu(value: boolean);
    get shadow(): boolean;
    set shadow(value: boolean);
    get documentEdited(): boolean;
    set documentEdited(value: boolean);
    get representedFilename(): string;
    set representedFilename(value: string);
    get simpleFullScreen(): boolean;
    set simpleFullScreen(value: boolean);
    get kiosk(): boolean;
    set kiosk(value: boolean);
    private _assertNotDestroyed;
    private _applyOptimisticState;
    private _captureInteractionState;
    private _restoreInteractionState;
    private _rollbackInteractionStateOnFailure;
    private _captureGeometryState;
    private _rollbackGeometryStateOnFailure;
    private _pruneDestroyedChildren;
    private _attachParentWindowLocal;
    private _detachChildWindowsLocal;
    private _assertCanSetParentWindow;
    private _waitForClosed;
    private _runCloseCascade;
    private _runBeforeUnloadHandlers;
    private _requestCloseCascade;
    private _destroyChildWindowsDepthFirst;
    private _destroyDescendantsDepthFirst;
    private _emitTypedEvent;
    private _emitNoArgsEvent;
    private _getNoArgsListenerAdapters;
    private _adaptNoArgsListener;
    private _resolveNoArgsListener;
    private _emitAppWindowEvent;
    /** @internal */
    _createWindowOpenChild(details: WebContentsWindowOpenDetails, options: BrowserWindowConstructorOptions, outlivesOpener: boolean): WebContents;
    private _completePendingLoad;
    private _rejectPendingLoad;
    private _completePendingLoadOnInPageNavigation;
    private _handlePendingLoadNavigationStart;
    private _clearPendingLoadStopTimer;
    private _rejectPendingLoadOnStopSoon;
    private _markDestroyedBeforeClosed;
    private _cleanupAfterClosed;
    private _cleanupAfterClose;
    private _applyNativeWindowMetadata;
    private _shouldTrackNormalBounds;
    private _applyNativeWindowGeometry;
    private _refreshCachedWindowGeometryFromNative;
    private _refreshCachedWindowMetadataFromNative;
    private _refreshCachedWindowStateFromNative;
    private _syncWebContentsVisibilityState;
    /** @internal */
    _getPageVisibilityStateForWebContents(): DocumentVisibilityState;
    /** @internal */
    _isShownForInteraction(): boolean;
    /** @internal */
    _handleNativeEvent(eventName: string, params?: BrowserWindowNativeEventParams): void;
    /**
     * Load a URL in the window
     */
    loadURL(url: string, options?: LoadURLOptions): Promise<void>;
    /**
     * Load a local HTML file in the window
     * @param filePath - Absolute path to the HTML file
     */
    loadFile(filePath: string, options?: LoadFileOptions): Promise<void>;
    /**
     * Reload the current page
     */
    reload(): void;
    getURL(): string;
    /** @deprecated Use `getURL()` for the cached synchronous URL. */
    getURLAsync(): Promise<string>;
    openDevTools(options?: WebContentsOpenDevToolsOptions): void;
    closeDevTools(): void;
    send(channel: string, ...args: unknown[]): void;
    focusOnWebView(): void;
    blurWebView(): void;
    capturePage(rect?: Rectangle, opts?: WebContentsCapturePageOptions): Promise<NativeImage>;
    showDefinitionForSelection(): void;
    getBackgroundThrottling(): boolean;
    setBackgroundThrottling(allowed: boolean): void;
    /**
     * Show the window and focus it
     */
    show(): void;
    /**
     * Show the window without focusing it
     */
    showInactive(): void;
    /**
     * Hide the window
     */
    hide(): void;
    /**
     * Close the window (triggers close event which can be prevented)
     */
    close(): void;
    /**
     * Force close the window without triggering close events
     */
    destroy(): void;
    /**
     * Attach this window to a parent window or detach it from its current parent.
     */
    setParentWindow(parentWindow: BrowserWindow | null): void;
    /**
     * Get the current parent window, if any.
     */
    getParentWindow(): BrowserWindow | null;
    /**
     * Get the immediate child windows for this window.
     */
    getChildWindows(): BrowserWindow[];
    /**
     * Check whether this window is currently attached as a modal child window.
     */
    isModal(): boolean;
    /**
     * Minimize the window
     */
    minimize(): void;
    /**
     * Maximize the window
     */
    maximize(): void;
    /**
     * Unmaximize the window (restore from maximized state)
     */
    unmaximize(): void;
    /**
     * Restore the window from minimized state
     */
    restore(): void;
    /**
     * Focus the window (bring to front)
     */
    focus(): void;
    /**
     * Blur the window (remove focus)
     */
    blur(): void;
    /**
     * Set fullscreen mode
     */
    setFullScreen(flag: boolean): void;
    /**
     * Check if window is in fullscreen mode
     */
    isFullScreen(): boolean;
    /**
     * Set the window size
     * @param width - Window width in pixels
     * @param height - Window height in pixels
     * @param animate - Animate the resize (macOS only)
     */
    setSize(width: number, height: number, animate?: boolean): void;
    /**
     * Get the window size
     * @returns [width, height]
     */
    getSize(): [number, number];
    /**
     * Set the content area size (excludes title bar)
     */
    setContentSize(width: number, height: number, animate?: boolean): void;
    /**
     * Get the content area size
     * @returns [width, height]
     */
    getContentSize(): [number, number];
    /**
     * Set minimum window size
     */
    setMinimumSize(width: number, height: number): void;
    /**
     * Get minimum window size
     * @returns [width, height]
     */
    getMinimumSize(): [number, number];
    /**
     * Set maximum window size
     */
    setMaximumSize(width: number, height: number): void;
    /**
     * Get maximum window size
     * @returns [width, height]
     */
    getMaximumSize(): [number, number];
    /**
     * Set the window position
     * @param x - X coordinate
     * @param y - Y coordinate
     * @param animate - Animate the move (macOS only)
     */
    setPosition(x: number, y: number, animate?: boolean): void;
    /**
     * Get the window position
     * @returns [x, y]
     */
    getPosition(): [number, number];
    /**
     * Center the window on screen
     */
    center(): void;
    /**
     * Set window bounds (position and size)
     * @param bounds - The bounds to set
     * @param animate - Animate the change (macOS only)
     */
    setBounds(bounds: Partial<Bounds>, animate?: boolean): void;
    /**
     * Get window bounds
     */
    getBounds(): Bounds;
    /**
     * Set content bounds (excludes title bar)
     */
    setContentBounds(bounds: Bounds, animate?: boolean): void;
    /**
     * Get content bounds
     */
    getContentBounds(): Bounds;
    /** @internal */
    _applyContentBoundsUpdated(bounds: Bounds): void;
    /**
     * Get normal bounds (bounds when not maximized/fullscreen)
     */
    getNormalBounds(): Bounds;
    /**
     * Set the window title
     */
    setTitle(title: string): void;
    /**
     * Get the window title
     */
    getTitle(): string;
    /**
     * Change the attachment point for sheets on macOS.
     */
    setSheetOffset(offsetY: number, offsetX?: number): void;
    /**
     * Preview a file with Quick Look on macOS.
     */
    previewFile(path: string, displayName?: string): void;
    /**
     * Close the currently open Quick Look preview on macOS.
     */
    closeFilePreview(): void;
    /**
     * Set the accessible window title used by assistive technologies.
     */
    setAccessibleTitle(title: string): void;
    /**
     * Get the accessible window title used by assistive technologies.
     */
    getAccessibleTitle(): string;
    /**
     * Set the background color
     * @param color - Hex color string (e.g., '#FFFFFF')
     */
    setBackgroundColor(color: string): void;
    /**
     * Get the background color
     */
    getBackgroundColor(): string;
    /**
     * Set window opacity
     * @param opacity - 0.0 (transparent) to 1.0 (opaque)
     */
    setOpacity(opacity: number): void;
    /**
     * Get window opacity
     */
    getOpacity(): number;
    /**
     * Set whether the window is resizable
     */
    setResizable(resizable: boolean): void;
    /**
     * Check if window is resizable
     */
    isResizable(): boolean;
    /**
     * Set whether the window is movable
     */
    setMovable(movable: boolean): void;
    /**
     * Check if window is movable
     */
    isMovable(): boolean;
    /**
     * Set whether the window is minimizable
     */
    setMinimizable(minimizable: boolean): void;
    /**
     * Check if window is minimizable
     */
    isMinimizable(): boolean;
    /**
     * Set whether the window is maximizable
     */
    setMaximizable(maximizable: boolean): void;
    /**
     * Check if window is maximizable
     */
    isMaximizable(): boolean;
    /**
     * Set whether the window is closable
     */
    setClosable(closable: boolean): void;
    /**
     * Check if window is closable
     */
    isClosable(): boolean;
    /**
     * Set whether the window can enter fullscreen
     */
    setFullScreenable(fullscreenable: boolean): void;
    /**
     * Check if window can enter fullscreen
     */
    isFullScreenable(): boolean;
    /**
     * Set always on top
     * @param flag - Whether to always be on top
     * @param level - The level (normal, floating, torn-off-menu, modal-panel, main-menu, status, pop-up-menu, screen-saver)
     */
    setAlwaysOnTop(flag: boolean, level?: string, relativeLevel?: number): void;
    /**
     * Check if window is always on top
     */
    isAlwaysOnTop(): boolean;
    /**
     * Move window above another desktop-capturer window source.
     */
    moveAbove(mediaSourceId: string): void;
    /**
     * Move window to top of z-order
     */
    moveTop(): void;
    getMediaSourceId(): string;
    getNativeWindowHandle(): Buffer;
    selectPreviousTab(): void;
    selectNextTab(): void;
    showAllTabs(): void;
    mergeAllWindows(): void;
    moveTabToNewWindow(): void;
    toggleTabBar(): void;
    addTabbedWindow(browserWindow: BrowserWindow): void;
    /**
     * Check if window is destroyed
     */
    isDestroyed(): boolean;
    /**
     * Check if window is visible
     */
    isVisible(): boolean;
    /**
     * Check if window is enabled.
     */
    isEnabled(): boolean;
    /**
     * Disable or enable the window.
     */
    setEnabled(enable: boolean): void;
    /**
     * Check if window is focused
     */
    isFocused(): boolean;
    /**
     * Check if window is minimized
     */
    isMinimized(): boolean;
    /**
     * Check if window is maximized
     */
    isMaximized(): boolean;
    /**
     * Check if window is in normal state (not minimized, maximized, or fullscreen)
     */
    isNormal(): boolean;
    /**
     * Set the macOS window animation behavior.
     */
    setAnimationBehavior(behavior: BrowserWindowAnimationBehavior): void;
    /**
     * Get the macOS window animation behavior.
     */
    getAnimationBehavior(): BrowserWindowAnimationBehavior;
    /**
     * Set the vibrancy effect (macOS)
     * @param type - The vibrancy type (null to remove)
     */
    setVibrancy(type: BrowserWindowVibrancy | null): void;
    /**
     * @deprecated On macOS this abstraction is lossy and confusing.
     * Use `setVibrancy()` for native materials, or rely on transparent window configuration for overlays.
     * @param material - The background material
     */
    setGlazeBackgroundMaterial(material: BrowserWindowGlazeBackgroundMaterial): void;
    /**
     * @deprecated On macOS this abstraction is lossy and confusing.
     * Use `setVibrancy()` for native materials, or transparent window configuration for overlays.
     */
    setBackgroundMaterial(material: BrowserWindowGlazeBackgroundMaterial): void;
    /**
     * Set the window button position (macOS)
     * @param position - The x,y position relative to window origin
     */
    setWindowButtonPosition(position: {
        x: number;
        y: number;
    }): void;
    /**
     * @deprecated Use setWindowButtonPosition instead.
     */
    setTrafficLightPosition(position: {
        x: number;
        y: number;
    }): void;
    /**
     * Get the window button position (macOS)
     */
    getWindowButtonPosition(): {
        x: number;
        y: number;
    } | null;
    /**
     * @deprecated Use getWindowButtonPosition instead.
     */
    getTrafficLightPosition(): {
        x: number;
        y: number;
    } | null;
    /**
     * Set window button visibility (macOS)
     * @param visible - Whether to show the window buttons
     */
    setWindowButtonVisibility(visible: boolean): void;
    /**
     * Set the represented filename (macOS)
     * Shows the file in the title bar with a file icon
     */
    setRepresentedFilename(filename: string): void;
    /**
     * Get the represented filename (macOS)
     */
    getRepresentedFilename(): string;
    /**
     * Set document edited state (macOS)
     * Shows a dot in the close button when true
     */
    setDocumentEdited(edited: boolean): void;
    /**
     * Check if document is edited (macOS)
     */
    isDocumentEdited(): boolean;
    /**
     * Set whether window has a shadow
     */
    setHasShadow(hasShadow: boolean): void;
    /**
     * Check if window has a shadow
     */
    hasShadow(): boolean;
    /**
     * Enter/exit simple fullscreen mode (macOS)
     * This uses a simpler fullscreen that doesn't create a new space
     */
    setSimpleFullScreen(flag: boolean): void;
    /**
     * Check if window is in simple fullscreen mode (macOS)
     */
    isSimpleFullScreen(): boolean;
    /**
     * Set the aspect ratio that the window should maintain
     * @param aspectRatio - The aspect ratio (width / height), or 0 to clear
     * @param extraSize - Extra size to exclude from aspect ratio calculation
     */
    setAspectRatio(aspectRatio: number, extraSize?: {
        width: number;
        height: number;
    }): void;
    /**
     * Set whether the window should ignore mouse events
     * @param ignore - Whether to ignore mouse events
     * @param options - Options (forward: whether to forward mouse messages to Chromium)
     */
    setIgnoreMouseEvents(ignore: boolean, options?: {
        forward?: boolean;
    }): void;
    /**
     * Prevent or allow the window contents from being captured by other apps.
     */
    setContentProtection(enable: boolean): void;
    /**
     * Check whether content protection is enabled for this window.
     */
    isContentProtected(): boolean;
    /**
     * Recompute the native window shadow.
     */
    invalidateShadow(): void;
    /**
     * Controls whether macOS hides the cursor while the user is typing.
     */
    setAutoHideCursor(autoHide: boolean): void;
    /**
     * Enter/exit kiosk mode
     */
    setKiosk(flag: boolean): void;
    /**
     * Check if window is in kiosk mode
     */
    isKiosk(): boolean;
    /**
     * Flash the window in the taskbar/dock
     * @param flag - Whether to start or stop flashing
     */
    flashFrame(flag: boolean): void;
    /**
     * Set progress bar on taskbar icon
     * @param progress - Progress value 0-1 (-1 to hide, > 1 for indeterminate)
     * @param options - Mode and whether to pause/error
     */
    setProgressBar(progress: number, options?: {
        mode?: "none" | "normal" | "indeterminate" | "error" | "paused";
    }): void;
    /**
     * Set whether window is visible on all workspaces (macOS/Linux)
     */
    setVisibleOnAllWorkspaces(visible: boolean, options?: {
        visibleOnFullScreen?: boolean;
        skipTransformProcessType?: boolean;
    }): void;
    /**
     * Check if window is visible on all workspaces
     */
    isVisibleOnAllWorkspaces(): boolean;
    /**
     * Set whether window is hidden in Mission Control (macOS)
     */
    setHiddenInMissionControl(hidden: boolean): void;
    /**
     * Check if window is hidden in Mission Control (macOS)
     */
    isHiddenInMissionControl(): boolean;
    /**
     * Set whether window appears in taskbar/dock
     */
    setSkipTaskbar(skip: boolean): void;
    /**
     * Set whether to exclude window from AeroSnap (Windows)
     */
    setExcludedFromShownWindowsMenu(exclude: boolean): void;
    /**
     * Check if window is excluded from shown windows menu (macOS)
     */
    isExcludedFromShownWindowsMenu(): boolean;
    /**
     * Set whether window is focusable
     */
    setFocusable(focusable: boolean): void;
    /**
     * Check if window is focusable
     */
    isFocusable(): boolean;
    on(event: BrowserWindowNoArgsEvent, listener: LegacyBrowserWindowEventObjectListener): this;
    on<K extends BrowserWindowNoArgsEvent>(event: K, listener: BrowserWindowEvents[K]): this;
    on<K extends keyof BrowserWindowEvents>(event: K, listener: BrowserWindowEvents[K]): this;
    once(event: BrowserWindowNoArgsEvent, listener: LegacyBrowserWindowEventObjectListener): this;
    once<K extends BrowserWindowNoArgsEvent>(event: K, listener: BrowserWindowEvents[K]): this;
    once<K extends keyof BrowserWindowEvents>(event: K, listener: BrowserWindowEvents[K]): this;
    off(event: BrowserWindowNoArgsEvent, listener: LegacyBrowserWindowEventObjectListener): this;
    off<K extends BrowserWindowNoArgsEvent>(event: K, listener: BrowserWindowEvents[K]): this;
    off<K extends keyof BrowserWindowEvents>(event: K, listener: BrowserWindowEvents[K]): this;
    emit<K extends keyof BrowserWindowEvents>(event: K, ...args: Parameters<BrowserWindowEvents[K]>): boolean;
    removeListener(event: BrowserWindowNoArgsEvent, listener: LegacyBrowserWindowEventObjectListener): this;
    removeListener<K extends BrowserWindowNoArgsEvent>(event: K, listener: BrowserWindowEvents[K]): this;
    removeListener<K extends keyof BrowserWindowEvents>(event: K, listener: BrowserWindowEvents[K]): this;
}
