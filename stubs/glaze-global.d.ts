/**
 * Global type declarations for Glaze SDK
 *
 * These types describe the full SDK-shaped window.glazeAPI interface.
 * A particular app only has the namespaces exposed by its renderer/preload.ts;
 * scaffolded apps expose a smaller secure default surface.
 */

// ============================================================================
// Dialog & Theme Types (inlined from native-api for self-containment)
// ============================================================================

interface FileFilter {
  name: string;
  extensions: string[];
}

interface OpenDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  properties?: Array<
    | "openFile"
    | "openDirectory"
    | "multiSelections"
    | "showHiddenFiles"
    | "createDirectory"
    | "promptToCreate"
    | "noResolveAliases"
    | "treatPackageAsDirectory"
    | "dontAddToRecent"
  >;
  message?: string;
  securityScopedBookmarks?: boolean;
}

interface OpenDialogResult {
  canceled: boolean;
  filePaths: string[];
  bookmarks?: string[];
}

interface SaveDialogOptions {
  title?: string;
  defaultPath?: string;
  buttonLabel?: string;
  filters?: FileFilter[];
  message?: string;
  nameFieldLabel?: string;
  showsTagField?: boolean;
  properties?: Array<
    "showHiddenFiles" | "createDirectory" | "treatPackageAsDirectory" | "showOverwriteConfirmation" | "dontAddToRecent"
  >;
  securityScopedBookmarks?: boolean;
}

interface SaveDialogResult {
  canceled: boolean;
  filePath: string;
  bookmark?: string;
}

interface MessageBoxOptions {
  type?: "none" | "info" | "error" | "question" | "warning";
  buttons?: string[];
  defaultId?: number;
  cancelId?: number;
  noLink?: boolean;
  normalizeAccessKeys?: boolean;
  title?: string;
  message: string;
  detail?: string;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  icon?: string | NativeImage;
  textWidth?: number;
  signal?: AbortSignal;
}

interface MessageBoxResult {
  response: number;
  checkboxChecked: boolean;
}

interface WebContentsInsertCSSOptions {
  cssOrigin?: "user" | "author";
}

interface WebContentsCloseOptions {
  waitForBeforeUnload?: boolean;
}

interface ShellOpenExternalOptions {
  activate?: boolean;
  workingDirectory?: string;
  logUsage?: boolean;
}

type ClipboardBinaryValue = ArrayBufferView | ArrayBuffer;
type ClipboardCustomValue = string | ClipboardBinaryValue;
type DatePickerMode = "date" | "time" | "dateAndTime";
type BrowserWindowAnimationBehavior = "default" | "none" | "documentWindow" | "utilityWindow" | "alertPanel";
type BrowserWindowVibrancy =
  | "titlebar"
  | "selection"
  | "menu"
  | "popover"
  | "sidebar"
  | "header"
  | "sheet"
  | "window"
  | "hud"
  | "fullscreen-ui"
  | "tooltip"
  | "content"
  | "under-window"
  | "under-page";
type BrowserWindowGlazeBackgroundMaterial = "auto" | "none" | "mica" | "acrylic" | "tabbed";

interface DatePickerOptions {
  mode: DatePickerMode;
  x: number;
  y: number;
  width?: number;
  height?: number;
  initialValue?: string;
  min?: string;
  max?: string;
}

interface DatePickerResult {
  canceled: boolean;
  value?: string;
}

interface NativeThemeInfo {
  shouldUseDarkColors: boolean;
  themeSource: "system" | "light" | "dark";
  accentColor?: string;
}

type MediaAccessType = "camera" | "microphone" | "screen";
type AskForMediaAccessType = "camera" | "microphone";

type SystemPreferencesAuthorizationType = "contacts" | "calendar" | "reminders" | "location";
type SystemPreferencesEffectiveAppearance = "dark" | "light" | "unknown";
type SystemPreferencesPreferredScrollerStyle = "legacy" | "overlay";
type SystemPreferencesUserDefaultType =
  | "string"
  | "boolean"
  | "integer"
  | "float"
  | "double"
  | "url"
  | "array"
  | "dictionary";

type SystemPreferencesJSONValue =
  | string
  | number
  | boolean
  | null
  | SystemPreferencesJSONValue[]
  | { [key: string]: SystemPreferencesJSONValue };

type SystemPreferencesPropertyListValue =
  | string
  | boolean
  | number
  | SystemPreferencesPropertyListValue[]
  | { [key: string]: SystemPreferencesPropertyListValue };

type SystemPreferencesUserDefaultValue = SystemPreferencesPropertyListValue;

interface SystemPreferencesAnimationSettings {
  shouldRenderRichAnimation: boolean;
  scrollAnimationsEnabledBySystem: boolean;
  prefersReducedMotion: boolean;
}

type SystemPreferencesNotificationCallback = (
  event: string,
  userInfo: Record<string, SystemPreferencesJSONValue>,
  object: string,
) => void;

type PermissionStatus = "granted" | "denied" | "restricted" | "not-determined" | "unknown";

type PermissionCapability = MediaAccessType | SystemPreferencesAuthorizationType | "accessibility" | "motion";

interface PermissionDiagnostic {
  timestamp: string;
  api:
    | "systemPreferences:getMediaAccessStatus"
    | "systemPreferences:askForMediaAccess"
    | "systemPreferences:requestScreenCaptureAccess"
    | "systemPreferences:getAuthorizationStatus"
    | "systemPreferences:isTrustedAccessibilityClient"
    | "location:getCurrentPosition"
    | "motion:status"
    | "motion:start";
  capability: PermissionCapability;
  status: "allowed" | "blocked";
  manifestPath?: string;
  reason?: string;
}

interface LocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface LocationPositionOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

type LocationPositionErrorCode = 1 | 2 | 3;

interface LocationPositionError {
  code: LocationPositionErrorCode;
  message: string;
  PERMISSION_DENIED: 1;
  POSITION_UNAVAILABLE: 2;
  TIMEOUT: 3;
}

type LocationPositionSuccessCallback = (position: LocationPosition) => void;
type LocationPositionErrorCallback = (error: LocationPositionError) => void;

// ============================================================================
// Glaze API Type Definitions
// ============================================================================

interface Point {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Display {
  id: number;
  label: string;
  bounds: Rectangle;
  workArea: Rectangle;
  size: { width: number; height: number };
  scaleFactor: number;
  rotation: number;
  internal: boolean;
  colorDepth?: number;
  colorSpace?: string;
  depthPerComponent?: number;
  displayFrequency?: number;
}

type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio" | "header" | "palette";

type MenuItemRole =
  | "undo"
  | "redo"
  | "cut"
  | "copy"
  | "paste"
  | "pasteAndMatchStyle"
  | "delete"
  | "selectAll"
  | "reload"
  | "forceReload"
  | "toggleDevTools"
  | "resetZoom"
  | "zoomIn"
  | "zoomOut"
  | "toggleSpellChecker"
  | "togglefullscreen"
  | "window"
  | "minimize"
  | "close"
  | "help"
  | "about"
  | "services"
  | "hide"
  | "hideOthers"
  | "unhide"
  | "quit"
  | "showSubstitutions"
  | "toggleSmartQuotes"
  | "toggleSmartDashes"
  | "toggleTextReplacement"
  | "startSpeaking"
  | "stopSpeaking"
  | "zoom"
  | "front"
  | "appMenu"
  | "fileMenu"
  | "editMenu"
  | "viewMenu"
  | "shareMenu"
  | "recentDocuments"
  | "toggleTabBar"
  | "selectNextTab"
  | "selectPreviousTab"
  | "showAllTabs"
  | "mergeAllWindows"
  | "clearRecentDocuments"
  | "moveTabToNewWindow"
  | "windowMenu";

interface SharingItem {
  texts?: string[];
  filePaths?: string[];
  urls?: string[];
}

interface MenuItemConstructorOptions {
  type?: MenuItemType;
  label?: string;
  sublabel?: string;
  toolTip?: string;
  accelerator?: string;
  icon?: string | NativeImage;
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
}

interface PopupOptions {
  items: MenuItemConstructorOptions[];
  x?: number;
  y?: number;
  positioningItem?: number;
  minWidth?: number;
}

interface PopupResult {
  commandId?: number;
}

interface GlazeIpcRendererEvent {
  channel?: string;
  ports: MessagePort[];
}

// ============================================================================
// Glaze API Interface
// ============================================================================

interface GlazeAPI {
  // Dialog APIs - dialog module
  dialog: {
    showOpenDialog: (options?: OpenDialogOptions) => Promise<OpenDialogResult>;
    showSaveDialog: (options?: SaveDialogOptions) => Promise<SaveDialogResult>;
    showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxResult>;
    showErrorBox: (title: string, content: string) => Promise<void>;
    showDatePicker: (options: DatePickerOptions) => Promise<DatePickerResult>;
  };

  // Shell APIs - shell module. Scaffolded apps expose only beep/beepAsync by default.
  shell: {
    openPath: (path: string) => Promise<string>;
    openExternal: (url: string, options?: ShellOpenExternalOptions) => Promise<void>;
    /** @deprecated Use openExternal() for Electron-compatible Promise<void> behavior. */
    openExternalWithResult: (url: string, options?: ShellOpenExternalOptions) => Promise<boolean>;
    showItemInFolder: (fullPath: string) => void;
    /** @deprecated Use showItemInFolder() for fire-and-forget behavior. */
    showItemInFolderAsync: (fullPath: string) => Promise<void>;
    trashItem: (path: string) => Promise<void>;
    beep: () => void;
    /** @deprecated Use beep() for fire-and-forget behavior. */
    beepAsync: () => Promise<void>;
  };

  // WebUtils APIs - webUtils module
  webUtils: {
    getPathForFile: (file: File) => string;
  };

  // Screen APIs - screen module. Requires explicit preload wiring in scaffolded apps.
  screen: {
    getCursorScreenPoint: () => Promise<Point>;
    getPrimaryDisplay: () => Promise<Display>;
    getAllDisplays: () => Promise<Display[]>;
    getDisplayNearestPoint: (point: Point) => Promise<Display>;
    getDisplayMatching: (rect: Rectangle) => Promise<Display>;
  };

  // Clipboard APIs. Requires explicit preload wiring in scaffolded apps.
  clipboard: {
    pasteboard: (name: string) => GlazeAPI["clipboard"];
    // Text
    readText: (type?: string) => Promise<string>;
    writeText: (text: string, type?: string) => Promise<void>;
    // HTML
    readHTML: (type?: string) => Promise<string>;
    writeHTML: (markup: string, text?: string, type?: string) => Promise<void>;
    // RTF
    readRTF: (type?: string) => Promise<string>;
    writeRTF: (text: string, type?: string) => Promise<void>;
    // Image — returns a full NativeImage (isEmpty()/toDataURL()/toPNG()/… ), matching
    // clipboard.readImage()'s Electron-parity NativeImage contract.
    readImage: (type?: string) => Promise<NativeImage>;
    writeImage: (
      image: { toDataURL(): string } | string | null,
      options?: { formats?: Array<"png" | "tiff" | "pdf">; type?: string } | string,
    ) => Promise<void>;
    // Bookmark (macOS/Windows)
    readBookmark: (type?: string) => Promise<{ title: string; url: string }>;
    writeBookmark: (title: string, url: string, type?: string) => Promise<void>;
    // Find Pasteboard (macOS)
    readFindText: () => Promise<string>;
    writeFindText: (text: string) => Promise<void>;
    // Utilities
    clear: (type?: string) => Promise<void>;
    /**
     * Returns every format reported by the system pasteboard, including aliases
     * and formats injected by clipboard managers.
     */
    availableFormats: (type?: string) => Promise<string[]>;
    has: (format: string, type?: string) => Promise<boolean>;
    read: (format: string, type?: string) => Promise<string>;
    readBuffer: (format: string, type?: string) => Promise<Uint8Array>;
    writeBuffer: (format: string, buffer: ClipboardBinaryValue, type?: string) => Promise<void>;
    write: (
      data: {
        text?: string;
        html?: string;
        rtf?: string;
        bookmark?: string;
        image?: { toDataURL(): string } | string | null;
        custom?: Record<string, ClipboardCustomValue>;
      },
      type?: string,
    ) => Promise<void>;
    writeWebCustomFormats: (formats: Record<string, ClipboardCustomValue>, type?: string) => Promise<void>;
    readWebCustomFormats: (type?: string) => Promise<Record<string, string>>;
    readFilePaths: (type?: string) => Promise<string[]>;
    writeFilePaths: (paths: string[], type?: string) => Promise<void>;
    changeCount: (type?: string) => Promise<number>;
    /**
     * Returns pasteboard items with their direct item types. This may be more
     * compact than availableFormats(), which includes system-level aliases.
     */
    items: (type?: string) => Promise<Array<{ types: string[]; name?: string }>>;
    /**
     * Polls the pasteboard change count and calls the listener with current
     * formats after a detected change. Rapid writes within one interval can be
     * coalesced by the system.
     */
    onChange: (listener: (formats: string[]) => void, options?: { intervalMs?: number }) => () => void;
  };

  /**
   * Requires explicit preload wiring in scaffolded apps.
   *
   * @deprecated Use `import { nativeImage } from "@glaze/core/utils"` instead.
   */
  nativeImage?: {
    createEmpty: () => NativeImage;
    createThumbnailFromPath: (path: string, size: Size) => Promise<NativeImage>;
    createFromPath: (path: string) => Promise<NativeImage>;
    createFromBitmap: (
      buffer: Uint8Array | ArrayBuffer,
      options: NativeImageCreateFromBitmapOptions,
    ) => Promise<NativeImage>;
    createFromBuffer: (
      buffer: Uint8Array | ArrayBuffer,
      options?: NativeImageCreateFromBufferOptions,
    ) => Promise<NativeImage>;
    createFromDataURL: (dataURL: string) => Promise<NativeImage>;
    createFromNamedImage: (imageName: string, hslShift?: number[]) => Promise<NativeImage>;
  };

  // SafeStorage APIs - safeStorage module. Requires explicit preload wiring in scaffolded apps.
  safeStorage: {
    isEncryptionAvailable: () => Promise<boolean>;
    isAsyncEncryptionAvailable: () => Promise<boolean>;
    encryptString: (plainText: string) => Promise<string>;
    encryptStringAsync: (plainText: string) => Promise<string>;
    decryptString: (encryptedBase64: string) => Promise<string>;
    decryptStringAsync: (encryptedBase64: string) => Promise<{ result: string; shouldReEncrypt: boolean }>;
    setUsePlainTextEncryption: (usePlainText: boolean) => Promise<void>;
    getSelectedStorageBackend: () => Promise<string>;
  };

  // Native Theme APIs - nativeTheme module
  nativeTheme: {
    getInfo: () => Promise<NativeThemeInfo>;
    setThemeSource: (source: "system" | "light" | "dark") => Promise<boolean>;
    getShouldUseDarkColors: () => Promise<boolean>;
    getThemeSource: () => Promise<"system" | "light" | "dark">;
  };

  // systemPreferences APIs - systemPreferences module. Scaffolded apps expose only a minimal subset by default.
  systemPreferences: {
    getMediaAccessStatus: (mediaType: MediaAccessType) => Promise<PermissionStatus>;
    askForMediaAccess: (mediaType: AskForMediaAccessType) => Promise<boolean>;
    requestScreenCaptureAccess: () => Promise<boolean>;
    getAuthorizationStatus: (type: SystemPreferencesAuthorizationType) => Promise<PermissionStatus>;
    isSwipeTrackingFromScrollEventsEnabled: () => Promise<boolean>;
    getPreferredScrollerStyle: () => Promise<SystemPreferencesPreferredScrollerStyle>;
    postNotification: (
      event: string,
      userInfo: Record<string, SystemPreferencesJSONValue>,
      deliverImmediately?: boolean,
    ) => Promise<void>;
    postLocalNotification: (event: string, userInfo: Record<string, SystemPreferencesJSONValue>) => Promise<void>;
    postWorkspaceNotification: (event: string, userInfo: Record<string, SystemPreferencesJSONValue>) => Promise<void>;
    subscribeNotification: (event: string | null, callback: SystemPreferencesNotificationCallback) => Promise<number>;
    subscribeLocalNotification: (
      event: string | null,
      callback: SystemPreferencesNotificationCallback,
    ) => Promise<number>;
    subscribeWorkspaceNotification: (
      event: string | null,
      callback: SystemPreferencesNotificationCallback,
    ) => Promise<number>;
    unsubscribeNotification: (id: number) => Promise<void>;
    unsubscribeLocalNotification: (id: number) => Promise<void>;
    unsubscribeWorkspaceNotification: (id: number) => Promise<void>;
    registerDefaults: (defaults: Record<string, SystemPreferencesUserDefaultValue>) => Promise<void>;
    getUserDefault: (key: string, type: SystemPreferencesUserDefaultType) => Promise<SystemPreferencesUserDefaultValue>;
    setUserDefault: (
      key: string,
      type: SystemPreferencesUserDefaultType,
      value: SystemPreferencesUserDefaultValue,
    ) => Promise<void>;
    removeUserDefault: (key: string) => Promise<void>;
    getAccentColor: () => Promise<string>;
    getColor: (color: string) => Promise<string>;
    getSystemColor: (color: string) => Promise<string>;
    getEffectiveAppearance: () => Promise<SystemPreferencesEffectiveAppearance>;
    canPromptTouchID: () => Promise<boolean>;
    promptTouchID: (reason: string) => Promise<void>;
    isTrustedAccessibilityClient: (prompt: boolean) => Promise<boolean>;
    getAnimationSettings: () => Promise<SystemPreferencesAnimationSettings>;
    getAccessibilityDisplayShouldReduceTransparency: () => Promise<boolean>;
  };

  // Location APIs - Glaze native location module
  location: {
    getCurrentPosition: {
      (options?: LocationPositionOptions): Promise<LocationPosition>;
      (
        success: LocationPositionSuccessCallback,
        error?: LocationPositionErrorCallback,
        options?: LocationPositionOptions,
      ): void;
    };
  };

  // App APIs - app module. Requires explicit preload wiring in scaffolded apps.
  app: {
    // App Info
    getName: () => Promise<string>;
    getVersion: () => Promise<string>;
    getPath: (name: string) => Promise<string>;
    getLocale: () => Promise<string>;
    getLocaleCountryCode: () => Promise<string>;
    isPackaged: () => Promise<boolean>;
    // App Visibility
    focus: (options?: { steal?: boolean }) => Promise<void>;
    hide: () => Promise<void>;
    show: () => Promise<void>;
    // Badge
    setBadgeCount: (count: number) => Promise<boolean>;
    getBadgeCount: () => Promise<number>;
    // Haptic Feedback (macOS)
    performHapticFeedback: (options?: { pattern?: "alignment" | "generic" | "level-change" }) => Promise<void>;
    // Lifecycle
    relaunch: (options?: { args?: string[]; execPath?: string }) => Promise<void>;
    exit: (exitCode?: number) => Promise<void>;
    // Login Items
    setLoginItemSettings: (settings: { openAtLogin: boolean }) => Promise<void>;
    getLoginItemSettings: () => Promise<{
      openAtLogin: boolean;
      wasOpenedAtLogin?: boolean;
      wasOpenedAsHidden?: boolean;
    }>;
    // Dock (macOS)
    dock: {
      hide: () => Promise<void>;
      show: () => Promise<void>;
      isVisible: () => Promise<boolean>;
      bounce: (type?: "critical" | "informational") => Promise<number>;
      cancelBounce: (id: number) => Promise<void>;
      setBadge: (text: string) => Promise<void>;
      getBadge: () => Promise<string>;
    };
  };

  // Menu APIs - Menu module
  Menu: {
    popup: (options: PopupOptions) => Promise<PopupResult>;
    setApplicationMenu: (template: MenuItemConstructorOptions[] | null) => Promise<void>;
  };

  // GlobalShortcut APIs - globalShortcut module. Requires explicit preload wiring in scaffolded apps.
  globalShortcut: {
    register: (accelerator: string) => Promise<boolean>;
    registerAll: (accelerators: string[]) => Promise<boolean>;
    isRegistered: (accelerator: string) => Promise<boolean>;
    unregister: (accelerator: string) => Promise<void>;
    unregisterAll: () => Promise<void>;
  };

  // Tray APIs - Tray module. Requires explicit preload wiring in scaffolded apps.
  Tray: {
    create: (id: string, imagePath: string, color?: string) => Promise<boolean>;
    destroy: (id: string) => Promise<void>;
    setImage: (id: string, imagePath: string, color?: string) => Promise<void>;
    setPressedImage: (id: string, imagePath: string, color?: string) => Promise<void>;
    setToolTip: (id: string, toolTip: string) => Promise<void>;
    setTitle: (id: string, title: string, fontType?: "monospaced" | "monospacedDigit") => Promise<void>;
    getTitle: (id: string) => Promise<string>;
    setContextMenu: (id: string, menuItems: MenuItemConstructorOptions[] | null) => Promise<void>;
    popUpContextMenu: (id: string, menuItems?: MenuItemConstructorOptions[], x?: number, y?: number) => Promise<void>;
    closeContextMenu: (id: string) => Promise<void>;
    getBounds: (id: string) => Promise<Rectangle>;
    setIgnoreDoubleClickEvents: (id: string, ignore: boolean) => Promise<void>;
    getIgnoreDoubleClickEvents: (id: string) => Promise<boolean>;
    onEvent: (id: string, callback: (eventName: string, event: unknown, bounds?: Rectangle) => void) => () => void;
  };

  // BrowserWindow APIs - BrowserWindow module. Requires explicit preload wiring in scaffolded apps;
  // prefer backend BrowserWindow APIs behind a narrow app IPC handler for renderer-triggered window control.
  BrowserWindow: {
    // Lifecycle
    create: (options: {
      windowKey?: string;
      /** @deprecated Use windowKey instead. */
      id?: string;
      parentId?: string | null;
      modal?: boolean;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      minWidth?: number;
      minHeight?: number;
      maxWidth?: number;
      maxHeight?: number;
      resizable?: boolean;
      movable?: boolean;
      minimizable?: boolean;
      maximizable?: boolean;
      closable?: boolean;
      alwaysOnTop?: boolean;
      fullscreenable?: boolean;
      title?: string;
      show?: boolean;
      center?: boolean;
      backgroundColor?: string;
      frame?: boolean;
      transparent?: boolean;
      opacity?: number;
      toolbarStyle?: "none" | "unified" | "unifiedCompact";
      fullscreen?: boolean;
      focusable?: boolean;
      hiddenInMissionControl?: boolean;
      visibleOnAllWorkspaces?: boolean;
      acceptFirstMouse?: boolean;
      /** @deprecated Use acceptFirstMouse instead. */
      acceptsFirstMouse?: boolean;
      skipTaskbar?: boolean;
      hasShadow?: boolean;
      simpleFullscreen?: boolean;
      kiosk?: boolean;
      trafficLightPosition?: { x: number; y: number };
      /** @deprecated Use trafficLightPosition instead. */
      windowButtonPosition?: { x: number; y: number };
      vibrancy?: BrowserWindowVibrancy | null;
      animationBehavior?: BrowserWindowAnimationBehavior;
      webPreferences?: {
        /** Whether to enable content JavaScript. Defaults to true. */
        javascript?: boolean;
        /** Whether textarea elements can be resized by the user. Defaults to true. */
        textAreasAreResizable?: boolean;
        /** Policy for animated images. Defaults to "animate". */
        imageAnimationPolicy?: "animate" | "animateOnce" | "noAnimation";
        /** Minimum font size for web content. Defaults to 0. */
        minimumFontSize?: number;
        /** Autoplay policy for media content. Defaults to "no-user-gesture-required". */
        autoplayPolicy?: "no-user-gesture-required" | "user-gesture-required" | "document-user-activation-required";
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
        /** Whether to throttle animations/timers when the window is hidden. Defaults to true. */
        backgroundThrottling?: boolean;
        /** Whether the web contents should be focused when navigating. Defaults to true. */
        focusOnNavigation?: boolean;
        userAgent?: string;
        /** Absolute path to preload script. Injected by runtime before page scripts. */
        preload?: string;
        /** Session partition. */
        partition?: string;
        /** Whether to enable session cache. */
        cache?: boolean;
        /** Alternative title exposed only to accessibility tools. */
        accessibleTitle?: string;
      };
    }) => Promise<{ id: string }>;
    loadURL: (id: string, url: string) => Promise<void>;
    show: (id: string) => Promise<void>;
    showInactive: (id: string) => Promise<void>;
    hide: (id: string) => Promise<void>;
    close: (id: string) => Promise<void>;
    destroy: (id: string) => Promise<void>;
    setParentWindow: (id: string, parentId: string | null) => Promise<void>;
    getParentWindow: (id: string) => Promise<{ parentId: string | null }>;
    getChildWindows: (id: string) => Promise<{ windowIds: string[] }>;
    isModal: (id: string) => Promise<{ modal: boolean }>;
    // Window state
    minimize: (id: string) => Promise<void>;
    maximize: (id: string) => Promise<void>;
    unmaximize: (id: string) => Promise<void>;
    restore: (id: string) => Promise<void>;
    focus: (id: string) => Promise<void>;
    blur: (id: string) => Promise<void>;
    reload: (id: string) => Promise<void>;
    // Size
    setSize: (id: string, width: number, height: number, animate?: boolean) => Promise<void>;
    getSize: (id: string) => Promise<{ width: number; height: number }>;
    setContentSize: (id: string, width: number, height: number, animate?: boolean) => Promise<void>;
    getContentSize: (id: string) => Promise<{ width: number; height: number }>;
    setMinimumSize: (id: string, width: number, height: number) => Promise<void>;
    getMinimumSize: (id: string) => Promise<{ width: number; height: number }>;
    setMaximumSize: (id: string, width: number, height: number) => Promise<void>;
    getMaximumSize: (id: string) => Promise<{ width: number; height: number }>;
    // Position
    setPosition: (id: string, x: number, y: number, animate?: boolean) => Promise<void>;
    getPosition: (id: string) => Promise<{ x: number; y: number }>;
    center: (id: string) => Promise<void>;
    // Bounds
    setBounds: (
      id: string,
      bounds: { x?: number; y?: number; width?: number; height?: number },
      animate?: boolean,
    ) => Promise<void>;
    getBounds: (id: string) => Promise<Rectangle>;
    // Title & Appearance
    setTitle: (id: string, title: string) => Promise<void>;
    getTitle: (id: string) => Promise<{ title: string }>;
    setBackgroundColor: (id: string, color: string) => Promise<void>;
    getBackgroundColor: (id: string) => Promise<{ color: string }>;
    setOpacity: (id: string, opacity: number) => Promise<void>;
    getOpacity: (id: string) => Promise<{ opacity: number }>;
    // Window capabilities
    setResizable: (id: string, resizable: boolean) => Promise<void>;
    isResizable: (id: string) => Promise<{ resizable: boolean }>;
    setMovable: (id: string, movable: boolean) => Promise<void>;
    isMovable: (id: string) => Promise<{ movable: boolean }>;
    setMinimizable: (id: string, minimizable: boolean) => Promise<void>;
    isMinimizable: (id: string) => Promise<{ minimizable: boolean }>;
    setMaximizable: (id: string, maximizable: boolean) => Promise<void>;
    isMaximizable: (id: string) => Promise<{ maximizable: boolean }>;
    setClosable: (id: string, closable: boolean) => Promise<void>;
    isClosable: (id: string) => Promise<{ closable: boolean }>;
    setFullScreenable: (id: string, fullscreenable: boolean) => Promise<void>;
    isFullScreenable: (id: string) => Promise<{ fullscreenable: boolean }>;
    setAlwaysOnTop: (id: string, alwaysOnTop: boolean, level?: string, relativeLevel?: number) => Promise<void>;
    isAlwaysOnTop: (id: string) => Promise<{ alwaysOnTop: boolean }>;
    moveTop: (id: string) => Promise<void>;
    // Fullscreen
    setFullScreen: (id: string, fullscreen: boolean) => Promise<void>;
    isFullScreen: (id: string) => Promise<{ fullscreen: boolean }>;
    // State queries
    getState: (
      id: string,
    ) => Promise<{ isVisible: boolean; isFocused: boolean; isMinimized: boolean; isMaximized: boolean }>;
    // Static methods
    getAllWindows: () => Promise<{ windowIds: string[] }>;
    getFocusedWindow: () => Promise<{ windowId: string | null }>;
    // Phase 2: macOS Appearance
    setAnimationBehavior: (id: string, behavior: BrowserWindowAnimationBehavior) => Promise<void>;
    getAnimationBehavior: (id: string) => Promise<{ behavior: BrowserWindowAnimationBehavior }>;
    setVibrancy: (id: string, type: BrowserWindowVibrancy | null) => Promise<void>;
    /** @deprecated Use setVibrancy() for native materials, or transparent window configuration for overlays. */
    setBackgroundMaterial: (id: string, material: BrowserWindowGlazeBackgroundMaterial) => Promise<void>;
    /** @deprecated Use setVibrancy() for native materials, or transparent window configuration for overlays. */
    setGlazeBackgroundMaterial: (id: string, material: BrowserWindowGlazeBackgroundMaterial) => Promise<void>;
    setWindowButtonPosition: (id: string, x: number, y: number) => Promise<void>;
    getWindowButtonPosition: (id: string) => Promise<{ x: number; y: number } | null>;
    setTrafficLightPosition: (id: string, x: number, y: number) => Promise<void>;
    getTrafficLightPosition: (id: string) => Promise<{ x: number; y: number } | null>;
    setWindowButtonVisibility: (id: string, visible: boolean) => Promise<void>;
    // Phase 2: Document APIs (macOS)
    setRepresentedFilename: (id: string, filename: string) => Promise<void>;
    getRepresentedFilename: (id: string) => Promise<{ filename: string }>;
    setDocumentEdited: (id: string, edited: boolean) => Promise<void>;
    isDocumentEdited: (id: string) => Promise<{ edited: boolean }>;
    // Phase 2: Shadow APIs
    setHasShadow: (id: string, hasShadow: boolean) => Promise<void>;
    hasShadow: (id: string) => Promise<{ hasShadow: boolean }>;
    // Phase 2: Simple Fullscreen (macOS)
    setSimpleFullScreen: (id: string, fullscreen: boolean) => Promise<void>;
    isSimpleFullScreen: (id: string) => Promise<{ simpleFullScreen: boolean }>;
    // Phase 3: Aspect Ratio
    setAspectRatio: (id: string, aspectRatio: number, extraWidth?: number, extraHeight?: number) => Promise<void>;
    // Phase 3: Mouse Events
    setIgnoreMouseEvents: (id: string, ignore: boolean, forward?: boolean) => Promise<void>;
    // Phase 3: Kiosk Mode
    setKiosk: (id: string, kiosk: boolean) => Promise<void>;
    isKiosk: (id: string) => Promise<{ kiosk: boolean }>;
    // Phase 3: Flash Frame
    flashFrame: (id: string, flash: boolean) => Promise<void>;
    // Phase 3: Progress Bar
    setProgressBar: (id: string, progress: number, mode?: string) => Promise<void>;
    // Phase 3: Visible on All Workspaces
    setVisibleOnAllWorkspaces: (
      id: string,
      visible: boolean,
      visibleOnFullScreen?: boolean,
      skipTransformProcessType?: boolean,
    ) => Promise<void>;
    isVisibleOnAllWorkspaces: (id: string) => Promise<{ visible: boolean }>;
    // Phase 3: Hidden in Mission Control
    setHiddenInMissionControl: (id: string, hidden: boolean) => Promise<void>;
    isHiddenInMissionControl: (id: string) => Promise<{ hidden: boolean }>;
    // Phase 3: Skip Taskbar
    setSkipTaskbar: (id: string, skip: boolean) => Promise<void>;
    // Phase 3: Excluded from Shown Windows Menu
    setExcludedFromShownWindowsMenu: (id: string, exclude: boolean) => Promise<void>;
    isExcludedFromShownWindowsMenu: (id: string) => Promise<{ excluded: boolean }>;
    // Phase 3: Focusable
    setFocusable: (id: string, focusable: boolean) => Promise<void>;
    isFocusable: (id: string) => Promise<{ focusable: boolean }>;
    // WebContents APIs
    webContents: {
      executeJavaScript: (id: string, code: string, userGesture?: boolean) => Promise<unknown>;
      setUserAgent: (id: string, userAgent: string) => Promise<void>;
      getUserAgent: (id: string) => Promise<string>;
      close: (id: string, options?: WebContentsCloseOptions) => Promise<void>;
      insertCSS: (id: string, css: string, options?: WebContentsInsertCSSOptions) => Promise<string>;
      removeInsertedCSS: (id: string, key: string) => Promise<void>;
      getURL: (id: string) => Promise<string>;
      openDevTools: (id: string) => Promise<boolean>;
      closeDevTools: (id: string) => Promise<boolean>;
      reload: (id: string) => Promise<void>;
      goBack: (id: string) => Promise<void>;
      goForward: (id: string) => Promise<void>;
      canGoBack: (id: string) => Promise<boolean>;
      canGoForward: (id: string) => Promise<boolean>;
      setZoomFactor: (id: string, factor: number) => Promise<void>;
      getZoomFactor: (id: string) => Promise<number>;
      setZoomLevel: (id: string, level: number) => Promise<void>;
      getZoomLevel: (id: string) => Promise<number>;
      print: (id: string, options?: Record<string, unknown>) => Promise<boolean>;
      printToPDF: (id: string, options?: Record<string, unknown>) => Promise<string>;
      capturePage: (
        id: string,
        rect?: Rectangle,
        opts?: { stayHidden?: boolean; stayAwake?: boolean },
      ) => Promise<{
        isEmpty: boolean;
        toDataURL(): string;
        getSize(): { width: number; height: number };
      }>;
      startDrag: (
        id: string,
        item:
          | { file: string; files?: string[]; icon: string | NativeImage }
          | { file?: string; files: string[]; icon: string | NativeImage },
      ) => Promise<void>;
      onEvent: (id: string, callback: (eventName: string, params?: unknown) => void) => () => void;
    };
    // Events
    onEvent: (id: string, callback: (eventName: string, params?: unknown) => void) => () => void;
  };

  // File APIs. Requires explicit preload wiring in scaffolded apps.
  file: {
    read: (filePath: string, encoding?: string) => Promise<string>;
    write: (filePath: string, content: string, encoding?: "utf8" | "base64") => Promise<{ success: boolean }>;
  };

  // Glaze-specific APIs
  glaze: {
    ipc: {
      invoke: <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
      send: (channel: string, ...args: unknown[]) => void;
      on: (channel: string, callback: (event: GlazeIpcRendererEvent, ...args: unknown[]) => void) => () => void;
      once: (channel: string, callback: (event: GlazeIpcRendererEvent, ...args: unknown[]) => void) => () => void;
      stream: <TChunk = unknown, TResult = unknown>(
        channel: string,
        args: unknown,
        onChunk: (chunk: TChunk) => void,
        options?: { cancellationId?: string },
      ) => Promise<TResult>;
      cancelStream: (cancellationId: string) => void;
      onNotification: (channel: string, callback: (params: unknown) => void) => () => void;
      isConnected: () => boolean;
      waitForReady: () => Promise<void>;
      disconnect: () => void;
    };
  };

  // Template app permissions diagnostics
  permissions?: {
    getDiagnostics: () => Promise<PermissionDiagnostic[]>;
  };
}

interface NativeImage {
  isEmpty(): boolean;
  getSize(scaleFactor?: number): Size;
  getAspectRatio(scaleFactor?: number): number;
  getScaleFactors(): number[];
  toDataURL(options?: NativeImageToDataURLOptions): string;
  toPNG(options?: NativeImageToPNGOptions): Promise<Uint8Array>;
  toJPEG(quality: number): Promise<Uint8Array>;
  toBitmap(options?: NativeImageToBitmapOptions): Promise<Uint8Array>;
  getBitmap(options?: NativeImageToBitmapOptions): Promise<Uint8Array>;
  getNativeHandle(): Promise<Uint8Array>;
  setTemplateImage(option: boolean): void;
  isTemplateImage(): boolean;
  isMacTemplateImage: boolean;
  crop(rect: Rectangle): Promise<NativeImage>;
  resize(options: NativeImageResizeOptions): Promise<NativeImage>;
  addRepresentation(options: NativeImageAddRepresentationOptions): Promise<void>;
}

interface NativeImageCreateFromBitmapOptions {
  width: number;
  height: number;
  scaleFactor?: number;
}

interface NativeImageCreateFromBufferOptions {
  width?: number;
  height?: number;
  scaleFactor?: number;
}

interface NativeImageToPNGOptions {
  scaleFactor?: number;
}

interface NativeImageToBitmapOptions {
  scaleFactor?: number;
}

interface NativeImageToDataURLOptions {
  scaleFactor?: number;
}

interface NativeImageResizeOptions {
  width?: number;
  height?: number;
  quality?: "good" | "better" | "best";
}

interface NativeImageAddRepresentationOptions {
  scaleFactor?: number;
  width?: number;
  height?: number;
  buffer?: Uint8Array | ArrayBuffer;
  dataURL?: string;
}

// ============================================================================
// Global Window Interface
// ============================================================================

declare global {
  interface Window {
    /** Glaze API exposed via contextBridge - the ONLY way to access IPC from renderer */
    glazeAPI: GlazeAPI;

    /** Sentry DSN injected by native layer from 1Password secrets */
    SENTRY_DSN?: string;

    /**
     * BCP-47 locale injected by the native layer, carrying the user's System
     * Settings overrides (hour cycle, calendar, first day of week) that
     * WKWebView's `Intl` default locale does not. Read it via `getSystemLocale()`
     * from `@glaze/core/utils` rather than touching this directly.
     */
    systemLocale?: string;

    /** WebKit message handlers (macOS) */
    webkit?: {
      messageHandlers?: {
        logger?: {
          postMessage: (message: { level: string; message: string }) => void;
        };
        "glaze-ipc"?: {
          postMessage: (message: unknown) => void;
        };
        /** Registers a contextBridge shape descriptor with the native layer */
        "glaze-bridge-register"?: {
          postMessage: (message: { worldId?: number; apiKey: string; shape: Record<string, unknown> }) => void;
        };
      };
    };

    /** Preload-world bridge for cross-world function calls (set by native) */
    __glazePreloadBridge?: {
      register(fnId: string, fn: (...args: unknown[]) => unknown): void;
      call(fnId: string, args: unknown[]): Promise<unknown>;
    };

    // React DevTools hook (injected by standalone DevTools)
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK_BACKUP__?: any;
    __REACT_DEVTOOLS_INJECTED__?: boolean;
  }
}

export {};
