/**
 * Native API Type Definitions
 *
 * types for dialog and theme APIs.
 */
import { type NativeImage } from "../backend/native-image.js";
import { type NativeImage as RendererNativeImage } from "../preload/native-image.js";
export interface FileFilter {
    name: string;
    extensions: string[];
}
export interface OpenDialogOptions {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: FileFilter[];
    properties?: Array<"openFile" | "openDirectory" | "multiSelections" | "showHiddenFiles" | "createDirectory" | "promptToCreate" | "noResolveAliases" | "treatPackageAsDirectory" | "dontAddToRecent">;
    message?: string;
    securityScopedBookmarks?: boolean;
}
export interface OpenDialogResult {
    canceled: boolean;
    filePaths: string[];
    bookmarks?: string[];
}
export interface SaveDialogOptions {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: FileFilter[];
    message?: string;
    nameFieldLabel?: string;
    showsTagField?: boolean;
    properties?: Array<"showHiddenFiles" | "createDirectory" | "treatPackageAsDirectory" | "showOverwriteConfirmation" | "dontAddToRecent">;
    securityScopedBookmarks?: boolean;
}
export interface SaveDialogResult {
    canceled: boolean;
    filePath: string;
    bookmark?: string;
}
export type MessageBoxIcon = NativeImage;
export interface MessageBoxOptions {
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
    icon?: string | MessageBoxIcon;
    textWidth?: number;
    signal?: AbortSignal;
}
export interface MessageBoxResult {
    response: number;
    checkboxChecked: boolean;
}
export type HapticFeedbackPattern = "alignment" | "generic" | "level-change";
export interface NativeThemeInfo {
    shouldUseDarkColors: boolean;
    themeSource: "system" | "light" | "dark";
    accentColor?: string;
    shouldUseHighContrastColors?: boolean;
    shouldUseDarkColorsForSystemIntegratedUI?: boolean;
    shouldUseInvertedColorScheme?: boolean;
    inForcedColorsMode?: boolean;
    prefersReducedTransparency?: boolean;
    shouldDifferentiateWithoutColor?: boolean;
}
export type MediaAccessType = "camera" | "microphone" | "screen";
export type AskForMediaAccessType = "camera" | "microphone";
export type SystemPreferencesAuthorizationType = "contacts" | "calendar" | "reminders" | "location";
export type SystemPreferencesEffectiveAppearance = "dark" | "light" | "unknown";
export type SystemPreferencesPreferredScrollerStyle = "legacy" | "overlay";
export type SystemPreferencesUserDefaultType = "string" | "boolean" | "integer" | "float" | "double" | "url" | "array" | "dictionary";
export type SystemPreferencesJSONValue = string | number | boolean | null | SystemPreferencesJSONValue[] | {
    [key: string]: SystemPreferencesJSONValue;
};
export type SystemPreferencesPropertyListValue = string | boolean | number | SystemPreferencesPropertyListValue[] | {
    [key: string]: SystemPreferencesPropertyListValue;
};
export type SystemPreferencesUserDefaultValue = SystemPreferencesPropertyListValue;
export interface SystemPreferencesAnimationSettings {
    shouldRenderRichAnimation: boolean;
    scrollAnimationsEnabledBySystem: boolean;
    prefersReducedMotion: boolean;
}
export interface SystemPreferencesNotificationPayload {
    subscriptionId: number;
    center: "distributed" | "local" | "workspace";
    event: string;
    userInfo: Record<string, SystemPreferencesJSONValue>;
    object?: string;
}
export type SystemPreferencesNotificationCallback = (event: string, userInfo: Record<string, SystemPreferencesJSONValue>, object: string) => void;
export type PermissionStatus = "granted" | "denied" | "restricted" | "not-determined" | "unknown";
export type PermissionCapability = MediaAccessType | SystemPreferencesAuthorizationType | "accessibility" | "motion";
export interface PermissionDiagnostic {
    timestamp: string;
    api: "systemPreferences:getMediaAccessStatus" | "systemPreferences:askForMediaAccess" | "systemPreferences:requestScreenCaptureAccess" | "systemPreferences:getAuthorizationStatus" | "systemPreferences:isTrustedAccessibilityClient" | "location:getCurrentPosition" | "motion:status" | "motion:start";
    capability: PermissionCapability;
    status: "allowed" | "blocked";
    manifestPath?: string;
    reason?: string;
}
export interface LocationPosition {
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
export interface LocationPositionOptions {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
}
export type LocationPositionErrorCode = 1 | 2 | 3;
export interface LocationPositionError {
    code: LocationPositionErrorCode;
    message: string;
    PERMISSION_DENIED: 1;
    POSITION_UNAVAILABLE: 2;
    TIMEOUT: 3;
}
export type LocationPositionSuccessCallback = (position: LocationPosition) => void;
export type LocationPositionErrorCallback = (error: LocationPositionError) => void;
/**
 * @deprecated `clipboard.readImage()` now returns a full {@link RendererNativeImage}
 * (Electron parity), where `isEmpty` is a METHOD (`isEmpty()`), not a boolean property.
 * This minimal shape is retained only for older call sites still referencing the type.
 */
export interface ClipboardImage {
    /** Whether the image is empty */
    isEmpty: boolean;
    /** Get data URL representation (data:image/png;base64,...) */
    toDataURL(): string;
    /** Get image dimensions */
    getSize(): {
        width: number;
        height: number;
    };
}
export interface ClipboardImageInput {
    /** Get data URL representation (data:image/png;base64,...) */
    toDataURL(): string;
}
/**
 * Bookmark data (title + URL)
 */
export interface ClipboardBookmark {
    title: string;
    url: string;
}
export type ClipboardPasteboardType = "clipboard" | "selection" | "general" | "find" | "drag" | "ruler" | "font" | (string & {});
export type ClipboardBuffer = ArrayBufferView;
/**
 * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
 */
export type ClipboardLegacyArrayBuffer = ArrayBuffer;
export type ClipboardBinaryValue = ClipboardBuffer | ClipboardLegacyArrayBuffer;
export type ClipboardCustomValue = string | ClipboardBinaryValue;
export interface ClipboardImageWriteOptions {
    formats?: Array<"png" | "tiff" | "pdf">;
    type?: ClipboardPasteboardType;
}
/**
 * Data for clipboard.write() - write multiple formats at once
 */
export interface ClipboardWriteData {
    text?: string;
    html?: string;
    rtf?: string;
    bookmark?: string;
    image?: ClipboardImageInput | string | null;
    custom?: Record<string, ClipboardCustomValue>;
}
export interface ClipboardItemInfo {
    types: string[];
    name?: string;
}
export interface ClipboardChangeOptions {
    intervalMs?: number;
}
export interface ClipboardAPI {
    readText(type?: ClipboardPasteboardType): Promise<string>;
    writeText(text: string, type?: ClipboardPasteboardType): Promise<void>;
    readHTML(type?: ClipboardPasteboardType): Promise<string>;
    writeHTML(markup: string, text?: string, type?: ClipboardPasteboardType): Promise<void>;
    readRTF(type?: ClipboardPasteboardType): Promise<string>;
    writeRTF(text: string, type?: ClipboardPasteboardType): Promise<void>;
    readImage(type?: ClipboardPasteboardType): Promise<RendererNativeImage>;
    writeImage(image: ClipboardImageInput | string | null, optionsOrType?: ClipboardImageWriteOptions | ClipboardPasteboardType): Promise<void>;
    readBookmark(type?: ClipboardPasteboardType): Promise<ClipboardBookmark>;
    writeBookmark(title: string, url: string, type?: ClipboardPasteboardType): Promise<void>;
    readFindText(): Promise<string>;
    writeFindText(text: string): Promise<void>;
    clear(type?: ClipboardPasteboardType): Promise<void>;
    availableFormats(type?: ClipboardPasteboardType): Promise<string[]>;
    has(format: string, type?: ClipboardPasteboardType): Promise<boolean>;
    read(format: string, type?: ClipboardPasteboardType): Promise<string>;
    readBuffer(format: string, type?: ClipboardPasteboardType): Promise<Uint8Array>;
    writeBuffer(format: string, buffer: ClipboardBuffer, type?: ClipboardPasteboardType): Promise<void>;
    /**
     * @deprecated Raw ArrayBuffer support is a Glaze compatibility extension. Pass a Buffer, typed array, or DataView.
     */
    writeBuffer(format: string, buffer: ClipboardLegacyArrayBuffer, type?: ClipboardPasteboardType): Promise<void>;
    write(data: ClipboardWriteData, type?: ClipboardPasteboardType): Promise<void>;
    writeWebCustomFormats(formats: Record<string, ClipboardCustomValue>, type?: ClipboardPasteboardType): Promise<void>;
    readWebCustomFormats(type?: ClipboardPasteboardType): Promise<Record<string, string>>;
    readFilePaths(type?: ClipboardPasteboardType): Promise<string[]>;
    writeFilePaths(paths: string[], type?: ClipboardPasteboardType): Promise<void>;
    changeCount(type?: ClipboardPasteboardType): Promise<number>;
    items(type?: ClipboardPasteboardType): Promise<ClipboardItemInfo[]>;
    onChange(listener: (formats: string[]) => void, options?: ClipboardChangeOptions): () => void;
    pasteboard(name: ClipboardPasteboardType): ClipboardAPI;
}
export type DatePickerMode = "date" | "time" | "dateAndTime";
export interface DatePickerOptions {
    mode: DatePickerMode;
    x: number;
    y: number;
    width?: number;
    height?: number;
    initialValue?: string;
    min?: string;
    max?: string;
}
export interface DatePickerResult {
    canceled: boolean;
    value?: string;
}
/**
 * Menu item types
 */
export type MenuItemType = "normal" | "separator" | "submenu" | "checkbox" | "radio" | "header" | "palette";
/**
 * Menu item constructor options (serializable subset for IPC)
 */
export interface MenuItemConstructorOptions {
    type?: MenuItemType;
    label?: string;
    accelerator?: string;
    icon?: string;
    enabled?: boolean;
    acceleratorWorksWhenHidden?: boolean;
    visible?: boolean;
    checked?: boolean;
    submenu?: MenuItemConstructorOptions[];
    id?: string;
    commandId?: number;
}
/**
 * Options for popup menu
 */
export interface PopupOptions {
    items: MenuItemConstructorOptions[];
    x?: number;
    y?: number;
    positioningItem?: number;
    minWidth?: number;
}
/**
 * Result from popup menu
 */
export interface PopupResult {
    commandId?: number;
}
