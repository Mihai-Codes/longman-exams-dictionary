import { EventEmitter } from "events";
import { type BrowserWindowConstructorOptions } from "./browser-window.js";
import { type IpcMainEvent, type ScopedIpcMain } from "./ipc-main.js";
import { type LoadFileOptions } from "./load-file-options.js";
import { type LoadURLOptions, type Referrer } from "./load-url-options.js";
import { MessagePortMain } from "./message-channel-main.js";
import { type NativeImage } from "./native-image.js";
import { type Point, type Rectangle, type Size } from "./screen.js";
import { Session, type Certificate, type DownloadURLOptions } from "./session.js";
import { WebFrameMain } from "./web-frame-main.js";
export interface WebContentsEvents {
    "did-finish-load": () => void;
    "did-fail-provisional-load": (event: WebContentsEvent, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number) => void;
    "did-frame-finish-load": (event: WebContentsEvent, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number) => void;
    "did-frame-navigate": (event: WebContentsEvent, url: string, httpResponseCode: number, httpStatusText: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number) => void;
    "did-create-window": (window: import("./browser-window.js").BrowserWindow, details: WebContentsDidCreateWindowDetails) => void;
    "will-frame-navigate": (details: WebContentsNavigationEvent) => void;
    "will-navigate": (details: WebContentsNavigationEvent) => void;
    "will-redirect": (details: WebContentsNavigationEvent) => void;
    "did-redirect-navigation": (details: WebContentsNavigationEvent) => void;
    "did-navigate": (eventOrURL: WebContentsDidNavigateEventOrURL, url: string, httpResponseCode: number, httpStatusText: string) => void;
    "did-navigate-in-page": (event: WebContentsEvent, url: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number) => void;
    "did-start-navigation": (details: WebContentsNavigationEvent) => void;
    "did-start-loading": () => void;
    "did-stop-loading": () => void;
    "dom-ready": () => void;
    focus: () => void;
    blur: () => void;
    "enter-html-full-screen": () => void;
    "leave-html-full-screen": () => void;
    "frame-created": (event: WebContentsEvent, details: WebContentsFrameCreatedDetails) => void;
    "page-favicon-updated": (event: WebContentsEvent, favicons: string[]) => void;
    "content-bounds-updated": (event: WebContentsEvent, bounds: Rectangle) => void;
    "console-message": (details: WebContentsConsoleMessageEvent) => void;
    "media-started-playing": () => void;
    "media-paused": () => void;
    "audio-state-changed": (event: WebContentsAudioStateChangedEvent) => void;
    "did-change-theme-color": (event: WebContentsEvent, color: string | null) => void;
    "update-target-url": (event: WebContentsEvent, url: string) => void;
    "devtools-opened": () => void;
    "devtools-closed": () => void;
    "devtools-focused": () => void;
    "input-event": (event: WebContentsEvent, inputEvent: WebContentsInputEvent) => void;
    "before-input-event": (event: WebContentsEvent, input: WebContentsBeforeInputEvent) => void;
    "before-mouse-event": (event: WebContentsEvent, mouse: WebContentsMouseInputEvent | WebContentsMouseWheelInputEvent) => void;
    "did-fail-load": WebContentsDidFailLoadListener;
    "found-in-page": (event: WebContentsEvent, result: WebContentsFoundInPageResult) => void;
    "page-title-updated": (event: WebContentsEvent, title: string, explicitSet: boolean) => void;
    "will-prevent-unload": (event: WebContentsEvent) => void;
    "render-process-gone": (event: WebContentsEvent, details: RenderProcessGoneDetails) => void;
    unresponsive: (event: WebContentsEvent) => void;
    responsive: () => void;
    "ipc-message": (event: IpcMainEvent, channel: string, ...args: unknown[]) => void;
    "ipc-message-sync": (event: IpcMainEvent, channel: string, ...args: unknown[]) => void;
    "zoom-changed": (event: WebContentsEvent, zoomDirection: WebContentsZoomDirection) => void;
    "devtools-open-url": (event: WebContentsEvent, url: string) => void;
    "devtools-search-query": (event: WebContentsEvent, query: string) => void;
    "devtools-reload-page": () => void;
    "certificate-error": (event: WebContentsEvent, url: string, error: string, certificate: Certificate, callback: WebContentsCertificateTrustCallback, isMainFrame: boolean) => void;
    "select-client-certificate": (event: WebContentsEvent, url: string, certificateList: Certificate[], callback: WebContentsSelectClientCertificateCallback) => void;
    login: (event: WebContentsEvent, authenticationResponseDetails: WebContentsAuthenticationResponseDetails, authInfo: WebContentsAuthInfo, callback: WebContentsLoginCallback) => void;
    "cursor-changed": (event: WebContentsEvent, type: WebContentsCursorType, image?: NativeImage, scale?: number, size?: Size, hotspot?: Point) => void;
    "context-menu": (event: WebContentsEvent, params: WebContentsContextMenuParams) => void;
    "select-bluetooth-device": (event: WebContentsEvent, devices: WebContentsBluetoothDevice[], callback: WebContentsSelectBluetoothDeviceCallback) => void;
    paint: (event: WebContentsPaintEvent, dirtyRect: Rectangle, image: NativeImage) => void;
    "will-attach-webview": (event: WebContentsEvent, webPreferences: WebContentsWebPreferences, params: Record<string, string>) => void;
    "did-attach-webview": (event: WebContentsEvent, webContents: WebContents) => void;
    "preload-error": (event: WebContentsEvent, preloadPath: string, error: Error) => void;
    "preferred-size-changed": (event: WebContentsEvent, preferredSize: Size) => void;
    destroyed: () => void;
}
export type WebContentsDidFailLoadListener = (event: WebContentsEvent, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number) => void;
export interface DebuggerEvents {
    detach: (event: Event, reason: string) => void;
    message: (event: Event, method: string, params: unknown, sessionId: string) => void;
}
export declare class Debugger extends EventEmitter {
    private readonly unsupportedMessage;
    attach(protocolVersion?: string): void;
    detach(): void;
    isAttached(): boolean;
    sendCommand(method: string, _commandParams?: unknown, _sessionId?: string): Promise<unknown>;
    on<K extends keyof DebuggerEvents>(event: K, listener: DebuggerEvents[K]): this;
    once<K extends keyof DebuggerEvents>(event: K, listener: DebuggerEvents[K]): this;
    off<K extends keyof DebuggerEvents>(event: K, listener: DebuggerEvents[K]): this;
    removeListener<K extends keyof DebuggerEvents>(event: K, listener: DebuggerEvents[K]): this;
    emit<K extends keyof DebuggerEvents>(event: K, ...args: Parameters<DebuggerEvents[K]>): boolean;
}
export interface WebContentsEvent {
    readonly type: keyof WebContentsEvents;
    readonly sender: WebContents;
    readonly defaultPrevented: boolean;
    preventDefault(): void;
}
type WebContentsDidNavigateEventOrURL = WebContentsEvent & string;
type LegacyDidFinishLoadListener = (requestId?: number) => void;
type LegacyWebContentsEventObjectListener = (event: WebContentsEvent) => void;
type WebContentsElectronNoArgsEvent = "media-started-playing" | "media-paused" | "devtools-opened" | "devtools-closed" | "devtools-focused";
export interface WebContentsNavigationEvent extends WebContentsEvent {
    readonly url: string;
    readonly isSameDocument: boolean;
    readonly isMainFrame: boolean;
    readonly frame: WebFrameMain | null;
    readonly initiator?: WebFrameMain | null;
    readonly processId: number;
    readonly routingId: number;
}
export type WebContentsConsoleMessageLevel = "debug" | "info" | "warning" | "error";
export interface WebContentsConsoleMessageEvent extends WebContentsEvent {
    readonly message: string;
    readonly level: WebContentsConsoleMessageLevel;
    readonly lineNumber: number;
    readonly sourceId: string;
    readonly frame: WebFrameMain;
}
export interface WebContentsAudioStateChangedEvent extends WebContentsEvent {
    readonly audible: boolean;
}
export interface WebContentsFrameCreatedDetails {
    readonly frame: WebFrameMain | null;
}
export type WebContentsZoomDirection = "in" | "out";
export type WebContentsCertificateTrustCallback = (isTrusted: boolean) => void;
export type WebContentsSelectClientCertificateCallback = (certificate?: Certificate | null) => void;
export interface WebContentsAuthenticationResponseDetails {
    url: string;
}
export interface WebContentsAuthInfo {
    isProxy: boolean;
    scheme: string;
    host: string;
    port: number;
    realm: string;
}
export type WebContentsLoginCallback = (username?: string, password?: string) => void;
export type WebContentsCursorType = "pointer" | "crosshair" | "hand" | "text" | "wait" | "help" | "e-resize" | "n-resize" | "ne-resize" | "nw-resize" | "s-resize" | "se-resize" | "sw-resize" | "w-resize" | "ns-resize" | "ew-resize" | "nesw-resize" | "nwse-resize" | "col-resize" | "row-resize" | "m-panning" | "m-panning-vertical" | "m-panning-horizontal" | "e-panning" | "n-panning" | "ne-panning" | "nw-panning" | "s-panning" | "se-panning" | "sw-panning" | "w-panning" | "move" | "vertical-text" | "cell" | "context-menu" | "alias" | "progress" | "nodrop" | "copy" | "none" | "not-allowed" | "zoom-in" | "zoom-out" | "grab" | "grabbing" | "custom" | "null" | "drag-drop-none" | "drag-drop-move" | "drag-drop-copy" | "drag-drop-link" | "ns-no-resize" | "ew-no-resize" | "nesw-no-resize" | "nwse-no-resize" | "default";
export type WebContentsContextMenuMediaType = "none" | "image" | "audio" | "video" | "canvas" | "file" | "plugin";
export type WebContentsContextMenuFormControlType = "none" | "button-button" | "field-set" | "input-button" | "input-checkbox" | "input-color" | "input-date" | "input-datetime-local" | "input-email" | "input-file" | "input-hidden" | "input-image" | "input-month" | "input-number" | "input-password" | "input-radio" | "input-range" | "input-reset" | "input-search" | "input-submit" | "input-telephone" | "input-text" | "input-time" | "input-url" | "input-week" | "output" | "reset-button" | "select-list" | "select-multiple" | "select-one" | "submit-button" | "text-area";
export type WebContentsContextMenuSourceType = "none" | "mouse" | "keyboard" | "touch" | "touchMenu" | "longPress" | "longTap" | "touchHandle" | "stylus" | "adjustSelection" | "adjustSelectionReset";
export interface WebContentsContextMenuMediaFlags {
    inError: boolean;
    isPaused: boolean;
    isMuted: boolean;
    hasAudio: boolean;
    isLooping: boolean;
    isControlsVisible: boolean;
    canToggleControls: boolean;
    canPrint: boolean;
    canSave: boolean;
    canShowPictureInPicture: boolean;
    isShowingPictureInPicture: boolean;
    canRotate: boolean;
    canLoop: boolean;
}
export interface WebContentsContextMenuEditFlags {
    canUndo: boolean;
    canRedo: boolean;
    canCut: boolean;
    canCopy: boolean;
    canPaste: boolean;
    canDelete: boolean;
    canSelectAll: boolean;
    canEditRichly: boolean;
}
export interface WebContentsContextMenuParams {
    x: number;
    y: number;
    frame: WebFrameMain | null;
    linkURL: string;
    linkText: string;
    pageURL: string;
    frameURL: string;
    srcURL: string;
    mediaType: WebContentsContextMenuMediaType;
    hasImageContents: boolean;
    isEditable: boolean;
    selectionText: string;
    titleText: string;
    altText: string;
    suggestedFilename: string;
    selectionRect: Rectangle;
    selectionStartOffset: number;
    referrerPolicy: Referrer;
    misspelledWord: string;
    dictionarySuggestions: string[];
    frameCharset: string;
    formControlType: WebContentsContextMenuFormControlType;
    spellcheckEnabled: boolean;
    menuSourceType: WebContentsContextMenuSourceType;
    mediaFlags: WebContentsContextMenuMediaFlags;
    editFlags: WebContentsContextMenuEditFlags;
}
export interface WebContentsBluetoothDevice {
    deviceName: string;
    deviceId: string;
}
export type WebContentsSelectBluetoothDeviceCallback = (deviceId: string) => void;
export interface WebContentsPaintEvent extends WebContentsEvent {
    readonly texture?: WebContentsOffscreenSharedTexture;
}
export type WebContentsOffscreenSharedTextureWidgetType = "popup" | "frame";
export type WebContentsOffscreenSharedTexturePixelFormat = "rgba" | "bgra" | "rgbaf16";
export interface WebContentsColorSpace {
    primaries: string;
    transfer: string;
    matrix: string;
    range: string;
}
export interface WebContentsSharedTextureHandle {
    ioSurface?: Buffer;
}
export interface WebContentsOffscreenSharedTextureMetadata {
    captureUpdateRect?: Rectangle;
    regionCaptureRect?: Rectangle;
    sourceSize?: Rectangle;
    frameCount?: number;
}
export interface WebContentsOffscreenSharedTextureInfo {
    widgetType: WebContentsOffscreenSharedTextureWidgetType;
    pixelFormat: WebContentsOffscreenSharedTexturePixelFormat;
    codedSize: Size;
    colorSpace: WebContentsColorSpace;
    visibleRect: Rectangle;
    contentRect: Rectangle;
    timestamp: number;
    metadata: WebContentsOffscreenSharedTextureMetadata;
    handle: WebContentsSharedTextureHandle;
}
export interface WebContentsOffscreenSharedTexture {
    textureInfo: WebContentsOffscreenSharedTextureInfo;
    release(): void;
}
export type WebContentsWebPreferences = NonNullable<BrowserWindowConstructorOptions["webPreferences"]> & Record<string, unknown>;
export interface WebContentsCapturePageOptions {
    stayHidden?: boolean;
    stayAwake?: boolean;
}
/** @deprecated `capturePage()` now resolves with `NativeImage`. */
export type WebContentsImage = NativeImage;
export type WebContentsStartDragItem = {
    file: string;
    files?: string[];
    icon: NativeImage | string;
} | {
    file?: string;
    files: string[];
    icon: NativeImage | string;
};
export interface WebContentsInsertCSSOptions {
    cssOrigin?: "user" | "author";
}
export interface WebContentsCloseOptions {
    waitForBeforeUnload?: boolean;
}
export interface WebContentsFindInPageOptions {
    forward?: boolean;
    findNext?: boolean;
    matchCase?: boolean;
}
export interface WebContentsAdjustSelectionOptions {
    start?: number;
    end?: number;
}
export interface WebContentsFoundInPageResult {
    requestId: number;
    activeMatchOrdinal: number;
    matches: number;
    selectionArea: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    finalUpdate: boolean;
}
export type WebContentsOpenDevToolsMode = "right" | "bottom" | "undocked" | "detach" | "left";
export interface WebContentsOpenDevToolsOptions {
    mode?: WebContentsOpenDevToolsMode;
    activate?: boolean;
    title?: string;
}
export interface SharedWorkerInfo {
    id: string;
    url: string;
}
export type WebContentsInputEventModifier = "shift" | "control" | "ctrl" | "alt" | "meta" | "command" | "cmd" | "iskeypad" | "isautorepeat" | "isAutoRepeat" | "leftbuttondown" | "middlebuttondown" | "rightbuttondown" | "capslock" | "numlock" | "left" | "right";
export interface WebContentsBaseInputEvent {
    type?: string;
    modifiers?: WebContentsInputEventModifier[];
}
export type WebContentsMouseInputEventType = "mouseDown" | "mouseUp" | "mouseEnter" | "mouseLeave" | "contextMenu" | "mouseMove";
export interface WebContentsMouseInputEvent extends WebContentsBaseInputEvent {
    type: WebContentsMouseInputEventType;
    x: number;
    y: number;
    button?: "left" | "middle" | "right";
    globalX?: number;
    globalY?: number;
    movementX?: number;
    movementY?: number;
    clickCount?: number;
}
export interface WebContentsMouseWheelInputEvent extends WebContentsBaseInputEvent {
    type: "mouseWheel";
    x: number;
    y: number;
    button?: "left" | "middle" | "right";
    globalX?: number;
    globalY?: number;
    movementX?: number;
    movementY?: number;
    clickCount?: number;
    deltaX?: number;
    deltaY?: number;
    wheelTicksX?: number;
    wheelTicksY?: number;
    accelerationRatioX?: number;
    accelerationRatioY?: number;
    hasPreciseScrollingDeltas?: boolean;
    canScroll?: boolean;
}
export interface WebContentsKeyboardInputEvent extends WebContentsBaseInputEvent {
    type: "rawKeyDown" | "keyDown" | "keyUp" | "char";
    keyCode: string;
}
export type WebContentsInputEvent = WebContentsMouseInputEvent | WebContentsMouseWheelInputEvent | WebContentsKeyboardInputEvent;
export interface WebContentsBeforeInputEvent {
    type: "keyDown" | "keyUp";
    key: string;
    code: string;
    isAutoRepeat: boolean;
    isComposing: boolean;
    shift: boolean;
    control: boolean;
    alt: boolean;
    meta: boolean;
    location: number;
    modifiers: WebContentsInputEventModifier[];
}
export interface PrinterInfo {
    name: string;
    displayName: string;
    description: string;
    options: Record<string, string>;
}
export type WebContentsPrintMarginType = "default" | "none" | "printableArea" | "custom";
export interface WebContentsPrintMargins {
    marginType?: WebContentsPrintMarginType;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}
export interface WebContentsPrintPageRange {
    from: number;
    to: number;
}
export type WebContentsPrintDuplexMode = "simplex" | "shortEdge" | "longEdge";
export type WebContentsPrintPageSize = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "Legal" | "Letter" | "Tabloid" | Size;
export interface WebContentsPrintOptions {
    silent?: boolean;
    printBackground?: boolean;
    deviceName?: string;
    color?: boolean;
    margins?: WebContentsPrintMargins;
    landscape?: boolean;
    scaleFactor?: number;
    pagesPerSheet?: number;
    collate?: boolean;
    copies?: number;
    pageRanges?: WebContentsPrintPageRange[];
    duplexMode?: WebContentsPrintDuplexMode;
    dpi?: Record<string, number>;
    header?: string;
    footer?: string;
    pageSize?: WebContentsPrintPageSize;
    usePrinterDefaultPageSize?: boolean;
    [key: string]: unknown;
}
export type WebContentsPrintCallback = (success: boolean, failureReason?: string) => void;
export type WebContentsPrintToPDFPageSize = WebContentsPrintPageSize | "Ledger";
export interface WebContentsPrintToPDFMargins {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}
export interface WebContentsPrintToPDFOptions {
    landscape?: boolean;
    displayHeaderFooter?: boolean;
    printBackground?: boolean;
    scale?: number;
    pageSize?: WebContentsPrintToPDFPageSize;
    margins?: WebContentsPrintToPDFMargins;
    pageRanges?: string;
    headerTemplate?: string;
    footerTemplate?: string;
    preferCSSPageSize?: boolean;
    generateTaggedPDF?: boolean;
    generateDocumentOutline?: boolean;
}
export interface NavigationEntry {
    url: string;
    title: string;
    pageState?: string;
}
export interface NavigationHistoryRestoreOptions {
    entries: NavigationEntry[];
    index?: number;
}
export type WebContentsWindowOpenDisposition = "default" | "foreground-tab" | "background-tab" | "new-window" | "other";
export interface WebContentsWindowOpenUploadRawData {
    type: "rawData";
    bytes: Buffer | Uint8Array | number[];
}
export interface WebContentsWindowOpenPostBody {
    data: WebContentsWindowOpenUploadRawData[];
    contentType: "application/x-www-form-urlencoded" | "multipart/form-data";
    boundary?: string;
}
export interface WebContentsWindowOpenDetails {
    url: string;
    frameName: string;
    features: string;
    disposition: WebContentsWindowOpenDisposition;
    referrer: Referrer;
    postBody?: WebContentsWindowOpenPostBody | null;
}
export interface WebContentsDidCreateWindowDetails extends WebContentsWindowOpenDetails {
    options: BrowserWindowConstructorOptions;
}
export type WebContentsCreateWindowFunction = (options: BrowserWindowConstructorOptions) => WebContents;
export interface WebContentsWindowOpenHandlerResponse {
    action: "allow" | "deny";
    overrideBrowserWindowOptions?: BrowserWindowConstructorOptions;
    outlivesOpener?: boolean;
    createWindow?: WebContentsCreateWindowFunction;
}
export type WebContentsWindowOpenHandler = (details: WebContentsWindowOpenDetails) => WebContentsWindowOpenHandlerResponse;
export interface WebSource {
    code: string;
    url?: string;
}
export type WebContentsStopFindInPageAction = "clearSelection" | "keepSelection" | "activateSelection";
export type WebContentsType = "window";
export type WebContentsFrameId = number | [number, number];
export type WebContentsFrameSubscriptionCallback = (image: NativeImage, dirtyRect: Rectangle) => void;
export interface WebContentsDeviceEmulationParameters {
    screenPosition?: "desktop" | "mobile";
    screenSize?: {
        width: number;
        height: number;
    };
    viewPosition?: {
        x: number;
        y: number;
    };
    deviceScaleFactor?: number;
    viewSize?: {
        width: number;
        height: number;
    };
    scale?: number;
}
export type WebContentsWebRTCIPHandlingPolicy = "default" | "default_public_interface_only" | "default_public_and_private_interfaces" | "disable_non_proxied_udp";
export interface WebContentsWebRTCUDPPortRange {
    min: number;
    max: number;
}
export type WebContentsImageAnimationPolicy = "animate" | "animateOnce" | "noAnimation";
export type WebContentsSavePageType = "HTMLOnly" | "HTMLComplete" | "MHTML";
export type RenderProcessGoneReason = "clean-exit" | "abnormal-exit" | "killed" | "crashed" | "oom" | "launch-failed" | "integrity-failure" | "memory-eviction";
export interface RenderProcessGoneDetails {
    reason: RenderProcessGoneReason;
    exitCode: number;
}
export declare function createWebContentsEvent(type: keyof WebContentsEvents, sender: WebContents): WebContentsEvent;
interface NativePreloadErrorDetails {
    preloadPath?: unknown;
    name?: unknown;
    message?: unknown;
    stack?: unknown;
}
export declare class WebContents extends EventEmitter {
    readonly windowId: string;
    private readonly runtimeId;
    private readonly owner;
    private lastKnownURL;
    private currentUserAgent;
    private currentZoomFactor;
    private loading;
    private loadingMainFrame;
    private waitingForResponse;
    private destroyed;
    private nextFindInPageRequestId;
    private audioMutedState;
    private currentlyAudibleState;
    private activeCaptureCount;
    private visibleCaptureCount;
    private frameSubscription;
    private frameSubscriptionCapturePending;
    private webRTCIPHandlingPolicy;
    private webRTCUDPPortRange;
    private backgroundThrottlingState;
    private pageVisibilityState;
    private imageAnimationPolicy;
    private osProcessId;
    private processId;
    private crashed;
    private rendererUnresponsive;
    private didEmitMainFrameCreated;
    private readonly childFrames;
    private readonly devToolsEnabled;
    private readonly javaScriptEnabled;
    private devToolsOpened;
    private devToolsFocused;
    private devToolsTitle;
    private devToolsWorkspacePaths;
    private devToolsTargetId;
    private customDevToolsWebContents;
    private openerFrame;
    private deviceEmulationParameters;
    private navigationEntries;
    private navigationActiveIndex;
    private windowOpenHandler;
    private pendingLoad;
    private pendingLoadStopTimer;
    private skipBeforeUnloadForNextLoad;
    private nextPendingLoadId;
    private currentDidFinishLoadRequestId;
    private printToPDFQueue;
    private readonly didFinishLoadListenerAdapters;
    private readonly didNavigateListenerAdapters;
    private readonly didFailLoadListenerAdapters;
    private readonly electronNoArgsListenerAdapters;
    private readonly unsubscribeWindowOpenNotification;
    readonly session: Session;
    readonly navigationHistory: NavigationHistory;
    readonly mainFrame: WebFrameMain;
    readonly debugger: Debugger;
    private readonly scopedIpc;
    constructor(windowId: string, owner?: import("./browser-window.js").BrowserWindow | null, session?: Session, partition?: string, cache?: boolean, initialUserAgent?: string, backgroundThrottling?: boolean, initialZoomFactor?: number, devToolsEnabled?: boolean, imageAnimationPolicy?: WebContentsImageAnimationPolicy, initialPageVisibilityState?: DocumentVisibilityState, javaScriptEnabled?: boolean);
    static getAllWebContents(): WebContents[];
    static getFocusedWebContents(): WebContents | null;
    static fromId(id: number): WebContents | undefined;
    static fromFrame(frame: WebFrameMain): WebContents | undefined;
    static fromDevToolsTargetId(targetId: string): WebContents | undefined;
    get id(): number;
    get ipc(): ScopedIpcMain;
    get hostWebContents(): WebContents | null;
    get devToolsWebContents(): WebContents | null;
    get opener(): WebFrameMain | null;
    get focusedFrame(): WebFrameMain | null;
    loadURL(url: string, options?: LoadURLOptions): Promise<void>;
    loadFile(filePath: string, options?: LoadFileOptions): Promise<void>;
    downloadURL(url: string, options?: DownloadURLOptions): void;
    /** @internal */
    _canDownloadURL(url: URL): boolean;
    executeJavaScript<T = unknown>(code: string, userGesture?: boolean): Promise<T>;
    private executeJavaScriptIgnoringPreference;
    executeJavaScriptInIsolatedWorld<T = unknown>(worldId: number, scripts: WebSource[], userGesture?: boolean): Promise<T>;
    setIgnoreMenuShortcuts(ignore: boolean): void;
    setWindowOpenHandler(handler: WebContentsWindowOpenHandler | null): void;
    setUserAgent(userAgent: string): void;
    getUserAgent(): string;
    get userAgent(): string;
    set userAgent(userAgent: string);
    insertCSS(css: string, options?: WebContentsInsertCSSOptions): Promise<string>;
    removeInsertedCSS(key: string): Promise<void>;
    getURL(): string;
    /** @deprecated Use `getURL()` for the cached synchronous URL. */
    getURLAsync(): Promise<string>;
    private refreshURLFromNative;
    getTitle(): string;
    isDestroyed(): boolean;
    private assertNotDestroyed;
    close(options?: WebContentsCloseOptions): void;
    focus(): void;
    isFocused(): boolean;
    isLoading(): boolean;
    isLoadingMainFrame(): boolean;
    isWaitingForResponse(): boolean;
    getType(): WebContentsType;
    isOffscreen(): boolean;
    startPainting(): void;
    stopPainting(): void;
    isPainting(): boolean;
    beginFrameSubscription(callback: WebContentsFrameSubscriptionCallback): void;
    beginFrameSubscription(onlyDirty: boolean, callback: WebContentsFrameSubscriptionCallback): void;
    endFrameSubscription(): void;
    setFrameRate(_fps: number): void;
    getFrameRate(): number;
    get frameRate(): number;
    set frameRate(fps: number);
    invalidate(): void;
    getWebRTCIPHandlingPolicy(): WebContentsWebRTCIPHandlingPolicy;
    setWebRTCIPHandlingPolicy(policy: WebContentsWebRTCIPHandlingPolicy): void;
    getWebRTCUDPPortRange(): WebContentsWebRTCUDPPortRange;
    setWebRTCUDPPortRange(udpPortRange: WebContentsWebRTCUDPPortRange): void;
    getBackgroundThrottling(): boolean;
    setBackgroundThrottling(allowed: boolean): void;
    get backgroundThrottling(): boolean;
    set backgroundThrottling(allowed: boolean);
    setImageAnimationPolicy(policy: WebContentsImageAnimationPolicy): void;
    getOSProcessId(): number;
    getProcessId(): number;
    takeHeapSnapshot(filePath: string): Promise<void>;
    isCrashed(): boolean;
    forcefullyCrashRenderer(): void;
    savePage(fullPath: string, saveType: WebContentsSavePageType): Promise<void>;
    goBack(): void;
    goForward(): void;
    canGoBack(): Promise<boolean>;
    canGoForward(): Promise<boolean>;
    setZoomFactor(factor: number): void;
    private applyZoomFactor;
    private propagateZoomFactorToSameOrigin;
    getZoomFactor(): number;
    /** @deprecated Use `getZoomFactor()` for the cached synchronous zoom factor. */
    getZoomFactorAsync(): Promise<number>;
    private refreshZoomFactorFromNative;
    get zoomFactor(): number;
    set zoomFactor(factor: number);
    setZoomLevel(level: number): void;
    getZoomLevel(): number;
    setVisualZoomLevelLimits(minimumLevel: number, maximumLevel: number): Promise<void>;
    get zoomLevel(): number;
    set zoomLevel(level: number);
    print(): void;
    print(options: WebContentsPrintOptions): void;
    print(options: undefined, callback: WebContentsPrintCallback): void;
    print(options: WebContentsPrintOptions, callback: WebContentsPrintCallback): void;
    print(options?: WebContentsPrintOptions, callback?: WebContentsPrintCallback): void;
    /** @deprecated Use `print()` with a callback for Electron-compatible completion handling. */
    printWithResult(): Promise<boolean>;
    printWithResult(options: WebContentsPrintOptions): Promise<boolean>;
    printWithResult(options: undefined, callback: WebContentsPrintCallback): Promise<boolean>;
    printWithResult(options: WebContentsPrintOptions, callback: WebContentsPrintCallback): Promise<boolean>;
    printWithResult(options?: WebContentsPrintOptions, callback?: WebContentsPrintCallback): Promise<boolean>;
    private performPrint;
    getPrintersAsync(): Promise<PrinterInfo[]>;
    setAudioMuted(muted: boolean): void;
    isAudioMuted(): boolean;
    get audioMuted(): boolean;
    set audioMuted(muted: boolean);
    isCurrentlyAudible(): boolean;
    printToPDF(options?: WebContentsPrintToPDFOptions): Promise<Buffer>;
    capturePage(rect?: Rectangle, opts?: WebContentsCapturePageOptions): Promise<NativeImage>;
    isBeingCaptured(): boolean;
    private queueFrameSubscriptionCapture;
    startDrag(item: WebContentsStartDragItem): void;
    showDefinitionForSelection(): void;
    undo(): void;
    redo(): void;
    cut(): void;
    copy(): void;
    centerSelection(): void;
    paste(): void;
    pasteAndMatchStyle(): void;
    copyImageAt(x: number, y: number): void;
    delete(): void;
    selectAll(): void;
    unselect(): void;
    scrollToTop(): void;
    scrollToBottom(): void;
    adjustSelection(options?: WebContentsAdjustSelectionOptions): void;
    replace(text: string): void;
    replaceMisspelling(text: string): void;
    insertText(text: string): Promise<void>;
    findInPage(text: string, options?: WebContentsFindInPageOptions): number;
    stopFindInPage(action: WebContentsStopFindInPageAction): void;
    sendInputEvent(inputEvent: WebContentsInputEvent): void;
    openDevTools(options?: WebContentsOpenDevToolsOptions): void;
    inspectElement(x: number, y: number): void;
    closeDevTools(): void;
    addWorkSpace(path: string): void;
    removeWorkSpace(path: string): void;
    setDevToolsWebContents(devToolsWebContents: WebContents): void;
    inspectSharedWorker(): void;
    inspectSharedWorkerById(workerId: string): void;
    getAllSharedWorkers(): SharedWorkerInfo[];
    inspectServiceWorker(): void;
    getOrCreateDevToolsTargetId(): string;
    isDevToolsOpened(): boolean;
    /** @deprecated Use `isDevToolsOpened()` for Electron-compatible synchronous cached state. */
    isDevToolsOpenedAsync(): Promise<boolean>;
    isDevToolsFocused(): boolean;
    /** @deprecated Use `isDevToolsFocused()` for Electron-compatible synchronous cached state. */
    isDevToolsFocusedAsync(): Promise<boolean>;
    getDevToolsTitle(): string;
    /** @deprecated Use `getDevToolsTitle()` for Electron-compatible synchronous cached state. */
    getDevToolsTitleAsync(): Promise<string>;
    setDevToolsTitle(title: string): void;
    toggleDevTools(): void;
    sendToFrame(frameId: WebContentsFrameId, channel: string, ...args: unknown[]): boolean;
    postMessage(channel: string, message: unknown, transfer?: MessagePortMain[]): void;
    /** @internal */
    _sendToFrame(frame: WebFrameMain, channel: string, ...args: unknown[]): boolean;
    /** @internal */
    _postMessageToFrame(frame: WebFrameMain, channel: string, message: unknown, transfer?: MessagePortMain[]): boolean;
    enableDeviceEmulation(parameters: WebContentsDeviceEmulationParameters): void;
    disableDeviceEmulation(): void;
    send(channel: string, ...args: unknown[]): void;
    reload(): void;
    stop(): void;
    reloadIgnoringCache(): void;
    /** @internal */
    _updateURL(url: string): void;
    /** @internal */
    _getCachedURL(): string;
    /** @internal */
    _emitIPCMessage(event: IpcMainEvent, channel: string, args: unknown[]): void;
    /** @internal */
    _emitWillPreventUnload(): boolean;
    /** @internal */
    _shouldRunBeforeUnloadBeforeLoad(): boolean;
    /** @internal */
    _skipBeforeUnloadForNextLoad(): void;
    /** @internal */
    _runBeforeUnloadHandlers(): Promise<boolean>;
    /** @internal */
    _emitPageTitleUpdated(title: string, explicitSet: boolean): void;
    _emitPageFaviconUpdated(favicons: string[]): void;
    _emitConsoleMessage(details: {
        level?: unknown;
        message?: unknown;
        lineNumber?: unknown;
        sourceId?: unknown;
    }): void;
    _emitMediaStartedPlaying(): void;
    _emitMediaPaused(): void;
    _emitAudioStateChanged(audible: boolean): void;
    _emitDidChangeThemeColor(color: unknown): void;
    _emitUpdateTargetURL(url: string): void;
    _emitCursorChanged(type: unknown): void;
    _emitContextMenu(params: unknown): void;
    _emitPreloadError(details: NativePreloadErrorDetails): void;
    _emitPreferredSizeChanged(preferredSize: Size): void;
    _emitDevToolsOpened(focused: boolean): void;
    _emitDevToolsClosed(): void;
    _emitDevToolsFocused(): void;
    _emitContentBoundsUpdated(bounds: Rectangle): boolean;
    _emitDomReady(): void;
    /** @internal */
    _emitEnterHtmlFullScreen(): void;
    /** @internal */
    _emitLeaveHtmlFullScreen(): void;
    _emitDidFrameFinishLoad(isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    _emitDidFrameNavigate(url: string, httpResponseCode: number, httpStatusText: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    _emitDidFailProvisionalLoad(errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    _emitDidFailLoad(errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, requestId?: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    _emitDidNavigateInPage(url: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    _emitDidNavigate(url: string, httpResponseCode: number, httpStatusText: string): void;
    _emitDidFinishLoad(requestId?: number): void;
    _emitWillFrameNavigate(url: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number): boolean;
    _emitWillNavigate(url: string, frameProcessId: number, frameRoutingId: number): boolean;
    _emitWillRedirect(url: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number): boolean;
    _emitDidRedirectNavigation(url: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number): void;
    _emitDidStartNavigation(url: string, isSameDocument: boolean, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number, parentFrameProcessId?: number, parentFrameRoutingId?: number): void;
    /** @internal */
    _updateUserAgent(userAgent: string): void;
    /** @internal */
    _updateProcessIds(osProcessId?: number, processId?: number): void;
    /** @internal */
    _markLoadStarted(): void;
    /** @internal */
    _markResponseReceived(): void;
    /** @internal */
    _markLoadStopped(): void;
    /** @internal */
    _markRendererGone(details?: Partial<RenderProcessGoneDetails>): void;
    /** @internal */
    _markDestroyed(): void;
    /** @internal */
    _completePendingLoadOnInPageNavigation(url: string, isMainFrame: boolean): boolean;
    /** @internal */
    _handlePendingLoadNavigationStart(url: string, isSameDocument: boolean, isMainFrame: boolean): void;
    private _completePendingLoad;
    private _rejectPendingLoad;
    private _clearPendingLoadStopTimer;
    private _rejectPendingLoadOnStopSoon;
    private _canExecuteJavaScriptNow;
    private _waitTillCanExecuteJavaScript;
    /** @internal */
    _markUnresponsive(): boolean;
    /** @internal */
    _markResponsive(): boolean;
    /** @internal */
    _markFocused(): void;
    /** @internal */
    _markBlurred(): void;
    /** @internal */
    _getOwner(): import("./browser-window.js").BrowserWindow | null;
    /** @internal */
    _getPageVisibilityState(): DocumentVisibilityState;
    /** @internal */
    _setPageVisibilityState(state: DocumentVisibilityState): void;
    /** @internal */
    _recomputePageVisibilityStateFromOwner(): void;
    /** @internal */
    _getChildFramesForParent(parent: WebFrameMain): WebFrameMain[];
    /** @internal */
    _frameForNavigationDetails(details: {
        url: string;
        isMainFrame: boolean;
        frameProcessId: number;
        frameRoutingId: number;
        parentFrameProcessId?: number;
        parentFrameRoutingId?: number;
    }): WebFrameMain | null;
    /** @internal */
    _frameForSenderMetadata(sender?: {
        isMainFrame?: boolean;
        frameProcessId?: number;
        frameRoutingId?: number;
        frameURL?: string;
    }): WebFrameMain | null;
    /** @internal */
    _navigationHistorySnapshot(): {
        entries: NavigationEntry[];
        activeIndex: number;
    };
    /** @internal */
    _navigationHistoryCanGoToIndex(index: number): boolean;
    /** @internal */
    _navigationHistoryGoToIndex(index: number): boolean;
    /** @internal */
    _navigationHistoryGoToOffset(offset: number): boolean;
    /** @internal */
    _navigationHistoryClear(): void;
    /** @internal */
    _navigationHistoryRemoveEntryAtIndex(index: number): boolean;
    /** @internal */
    _navigationHistoryRestore(entries: NavigationEntry[], index: number): void;
    /** @internal */
    _setOpener(frame: WebFrameMain | null): void;
    /** @internal */
    _handleWindowOpenRequest(request: unknown): Promise<WebContents | null>;
    private performEditingCommand;
    private refreshCurrentlyAudibleState;
    private setCurrentlyAudibleState;
    private _recordNavigationEntry;
    private childFrameKey;
    private frameForSendTarget;
    private resolveParentFrame;
    private getOrCreateChildFrame;
    private recordFrameForLifecycleEvent;
    private validateRendererSend;
    private dispatchRendererSend;
    private dispatchRendererSendToFrame;
    private clearChildFrames;
    private adaptDidFinishLoadListener;
    private resolveDidFinishLoadListener;
    private adaptDidNavigateListener;
    private resolveDidNavigateListener;
    private adaptDidFailLoadListener;
    private resolveDidFailLoadListener;
    private getElectronNoArgsListenerAdapters;
    private adaptElectronNoArgsListener;
    private resolveElectronNoArgsListener;
    on(event: WebContentsElectronNoArgsEvent, listener: LegacyWebContentsEventObjectListener): this;
    on<K extends WebContentsElectronNoArgsEvent>(event: K, listener: WebContentsEvents[K]): this;
    on(event: "did-finish-load", listener: LegacyDidFinishLoadListener): this;
    on<K extends keyof WebContentsEvents>(event: K, listener: WebContentsEvents[K]): this;
    once(event: WebContentsElectronNoArgsEvent, listener: LegacyWebContentsEventObjectListener): this;
    once<K extends WebContentsElectronNoArgsEvent>(event: K, listener: WebContentsEvents[K]): this;
    once(event: "did-finish-load", listener: LegacyDidFinishLoadListener): this;
    once<K extends keyof WebContentsEvents>(event: K, listener: WebContentsEvents[K]): this;
    off(event: WebContentsElectronNoArgsEvent, listener: LegacyWebContentsEventObjectListener): this;
    off<K extends WebContentsElectronNoArgsEvent>(event: K, listener: WebContentsEvents[K]): this;
    off(event: "did-finish-load", listener: LegacyDidFinishLoadListener): this;
    off<K extends keyof WebContentsEvents>(event: K, listener: WebContentsEvents[K]): this;
    emit(event: "did-navigate", url: string): boolean;
    emit(event: "did-navigate", webContentsEvent: WebContentsDidNavigateEventOrURL, url: string, httpResponseCode: number, httpStatusText: string): boolean;
    emit(event: "did-fail-load", errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, requestId?: number): boolean;
    emit(event: "did-fail-load", webContentsEvent: WebContentsEvent, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean, frameProcessId: number, frameRoutingId: number): boolean;
    emit<K extends keyof WebContentsEvents>(event: K, ...args: Parameters<WebContentsEvents[K]>): boolean;
    removeListener(event: WebContentsElectronNoArgsEvent, listener: LegacyWebContentsEventObjectListener): this;
    removeListener<K extends WebContentsElectronNoArgsEvent>(event: K, listener: WebContentsEvents[K]): this;
    removeListener(event: "did-finish-load", listener: LegacyDidFinishLoadListener): this;
    removeListener<K extends keyof WebContentsEvents>(event: K, listener: WebContentsEvents[K]): this;
}
export declare class NavigationHistory {
    private readonly webContents;
    constructor(webContents: WebContents);
    canGoBack(): boolean;
    canGoForward(): boolean;
    canGoToOffset(offset: number): boolean;
    clear(): void;
    getActiveIndex(): number;
    getEntryAtIndex(index: number): NavigationEntry | null;
    goBack(): void;
    goForward(): void;
    goToIndex(index: number): void;
    goToOffset(offset: number): void;
    length(): number;
    removeEntryAtIndex(index: number): boolean;
    getAllEntries(): NavigationEntry[];
    restore(options: NavigationHistoryRestoreOptions): Promise<void>;
}
export {};
