/**
 * systemPreferences - system preference APIs
 *
 * Exposes system preference APIs on macOS through the native bridge.
 */
import { EventEmitter } from "events";
import { type AskForMediaAccessType, type MediaAccessType, type PermissionStatus, type SystemPreferencesAnimationSettings, type SystemPreferencesAuthorizationType, type SystemPreferencesEffectiveAppearance, type SystemPreferencesJSONValue, type SystemPreferencesNotificationCallback, type SystemPreferencesNotificationPayload, type SystemPreferencesPreferredScrollerStyle, type SystemPreferencesPropertyListValue, type SystemPreferencesUserDefaultType, type SystemPreferencesUserDefaultValue } from "../ipc/native-api.js";
interface SystemPreferencesEvents {
    notification: [payload: SystemPreferencesNotificationPayload];
}
export interface SystemPreferencesUserDefaultTypes {
    string: string;
    boolean: boolean;
    integer: number;
    float: number;
    double: number;
    url: string;
    array: SystemPreferencesPropertyListValue[];
    dictionary: {
        [key: string]: SystemPreferencesPropertyListValue;
    };
}
export type SystemPreferencesPrivacyPane = "calendar" | "contacts" | "reminders";
type SwipeTrackingCommandRunner = (command: string, args: string[]) => string;
export declare function __clearSystemPreferencesColorCacheForTests(): void;
declare class SystemPreferences extends EventEmitter {
    private callbacks;
    private registeredDefaults;
    private userDefaultOverrides;
    private removedUserDefaultKeys;
    private nextSubscriptionId;
    private notificationListenerSetup;
    private _effectiveAppearance;
    private _accessibilityDisplayShouldReduceTransparency;
    constructor();
    private setupEffectiveAppearanceTracking;
    private updateEffectiveAppearanceFromThemeInfo;
    private updateEffectiveAppearanceFromNativeTheme;
    private ensureNotificationListener;
    private setCallback;
    private clearCallback;
    private allocateSubscriptionId;
    private callNativeFireAndForget;
    private subscribeNotificationSync;
    private subscribeNotificationWithNativeConfirmation;
    getMediaAccessStatus(mediaType: MediaAccessType): Promise<PermissionStatus>;
    askForMediaAccess(mediaType: AskForMediaAccessType): Promise<boolean>;
    requestScreenCaptureAccess(): Promise<boolean>;
    getAuthorizationStatus(type: SystemPreferencesAuthorizationType): Promise<PermissionStatus>;
    /** Opens the matching Privacy & Security pane so a denied permission can be changed manually. */
    openPrivacySettings(pane: SystemPreferencesPrivacyPane): Promise<void>;
    isSwipeTrackingFromScrollEventsEnabled(): boolean;
    /** @deprecated Use `isSwipeTrackingFromScrollEventsEnabled()` for Electron-compatible synchronous behavior. */
    isSwipeTrackingFromScrollEventsEnabledAsync(): Promise<boolean>;
    getPreferredScrollerStyle(): Promise<SystemPreferencesPreferredScrollerStyle>;
    postNotification(event: string, userInfo: Record<string, SystemPreferencesJSONValue>, deliverImmediately?: boolean): void;
    /** @deprecated Use `postNotification()` for Electron-compatible fire-and-forget behavior. */
    postNotificationAsync(event: string, userInfo: Record<string, SystemPreferencesJSONValue>, deliverImmediately?: boolean): Promise<void>;
    postLocalNotification(event: string, userInfo: Record<string, SystemPreferencesJSONValue>): void;
    /** @deprecated Use `postLocalNotification()` for Electron-compatible fire-and-forget behavior. */
    postLocalNotificationAsync(event: string, userInfo: Record<string, SystemPreferencesJSONValue>): Promise<void>;
    postWorkspaceNotification(event: string, userInfo: Record<string, SystemPreferencesJSONValue>): void;
    /** @deprecated Use `postWorkspaceNotification()` for Electron-compatible fire-and-forget behavior. */
    postWorkspaceNotificationAsync(event: string, userInfo: Record<string, SystemPreferencesJSONValue>): Promise<void>;
    subscribeNotification(event: string | null, callback: SystemPreferencesNotificationCallback): number;
    /** @deprecated Use `subscribeNotification()` for Electron-compatible synchronous id allocation. */
    subscribeNotificationAsync(event: string | null, callback: SystemPreferencesNotificationCallback): Promise<number>;
    subscribeLocalNotification(event: string | null, callback: SystemPreferencesNotificationCallback): number;
    /** @deprecated Use `subscribeLocalNotification()` for Electron-compatible synchronous id allocation. */
    subscribeLocalNotificationAsync(event: string | null, callback: SystemPreferencesNotificationCallback): Promise<number>;
    subscribeWorkspaceNotification(event: string | null, callback: SystemPreferencesNotificationCallback): number;
    /** @deprecated Use `subscribeWorkspaceNotification()` for Electron-compatible synchronous id allocation. */
    subscribeWorkspaceNotificationAsync(event: string | null, callback: SystemPreferencesNotificationCallback): Promise<number>;
    unsubscribeNotification(id: number): void;
    /** @deprecated Use `unsubscribeNotification()` for Electron-compatible fire-and-forget behavior. */
    unsubscribeNotificationAsync(id: number): Promise<void>;
    unsubscribeLocalNotification(id: number): void;
    /** @deprecated Use `unsubscribeLocalNotification()` for Electron-compatible fire-and-forget behavior. */
    unsubscribeLocalNotificationAsync(id: number): Promise<void>;
    unsubscribeWorkspaceNotification(id: number): void;
    /** @deprecated Use `unsubscribeWorkspaceNotification()` for Electron-compatible fire-and-forget behavior. */
    unsubscribeWorkspaceNotificationAsync(id: number): Promise<void>;
    registerDefaults(defaults: Record<string, SystemPreferencesUserDefaultValue>): void;
    /** @deprecated Use `registerDefaults()` for Electron-compatible fire-and-forget behavior. */
    registerDefaultsAsync(defaults: Record<string, SystemPreferencesUserDefaultValue>): Promise<void>;
    getUserDefault<Type extends keyof SystemPreferencesUserDefaultTypes>(key: string, type: Type): SystemPreferencesUserDefaultTypes[Type];
    getUserDefault(key: string, type: SystemPreferencesUserDefaultType): SystemPreferencesUserDefaultValue;
    getUserDefault(key: string, type: string): SystemPreferencesUserDefaultValue | undefined;
    /** @deprecated Use `getUserDefault()` for Electron-compatible synchronous reads. */
    getUserDefaultAsync<Type extends keyof SystemPreferencesUserDefaultTypes>(key: string, type: Type): Promise<SystemPreferencesUserDefaultTypes[Type]>;
    getUserDefaultAsync(key: string, type: SystemPreferencesUserDefaultType): Promise<SystemPreferencesUserDefaultValue>;
    getUserDefaultAsync(key: string, type: string): Promise<SystemPreferencesUserDefaultValue | undefined>;
    setUserDefault(key: string, type: SystemPreferencesUserDefaultType, value: SystemPreferencesUserDefaultValue): void;
    /** @deprecated Use `setUserDefault()` for Electron-compatible fire-and-forget behavior. */
    setUserDefaultAsync(key: string, type: SystemPreferencesUserDefaultType, value: SystemPreferencesUserDefaultValue): Promise<void>;
    removeUserDefault(key: string): void;
    /** @deprecated Use `removeUserDefault()` for Electron-compatible fire-and-forget behavior. */
    removeUserDefaultAsync(key: string): Promise<void>;
    getAccentColor(): string;
    /** @deprecated Use `getAccentColor()` for Electron-compatible synchronous reads. */
    getAccentColorAsync(): Promise<string>;
    getColor(color: string): string;
    /** @deprecated Use `getColor()` for Electron-compatible synchronous reads. */
    getColorAsync(color: string): Promise<string>;
    getSystemColor(color: string): string;
    /** @deprecated Use `getSystemColor()` for Electron-compatible synchronous reads. */
    getSystemColorAsync(color: string): Promise<string>;
    getEffectiveAppearance(): SystemPreferencesEffectiveAppearance;
    /** @deprecated Use `getEffectiveAppearance()` for the synchronous cached appearance. */
    getEffectiveAppearanceAsync(): Promise<SystemPreferencesEffectiveAppearance>;
    canPromptTouchID(): boolean;
    /** @deprecated Use `canPromptTouchID()` for Electron-compatible synchronous reads. */
    canPromptTouchIDAsync(): Promise<boolean>;
    promptTouchID(reason: string): Promise<void>;
    isTrustedAccessibilityClient(prompt: boolean): Promise<boolean>;
    getAnimationSettings(): SystemPreferencesAnimationSettings;
    /** @deprecated Use `getAnimationSettings()` for Electron-compatible synchronous behavior. */
    getAnimationSettingsAsync(): Promise<SystemPreferencesAnimationSettings>;
    getAccessibilityDisplayShouldReduceTransparency(): Promise<boolean>;
    get effectiveAppearance(): SystemPreferencesEffectiveAppearance;
    get accessibilityDisplayShouldReduceTransparency(): boolean;
    on<K extends keyof SystemPreferencesEvents>(event: K, listener: (...args: SystemPreferencesEvents[K]) => void): this;
}
export declare const systemPreferences: SystemPreferences;
export declare function __setSystemPreferencesSwipeTrackingCommandRunnerForTests(runner: SwipeTrackingCommandRunner | null): void;
export type { SystemPreferencesAnimationSettings, SystemPreferencesEffectiveAppearance, SystemPreferencesJSONValue, SystemPreferencesNotificationCallback, SystemPreferencesNotificationPayload, SystemPreferencesPreferredScrollerStyle, SystemPreferencesUserDefaultType, SystemPreferencesUserDefaultValue, };
