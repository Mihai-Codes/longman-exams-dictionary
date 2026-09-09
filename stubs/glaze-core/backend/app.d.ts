/**
 * App - application lifecycle API
 *
 * Provides lifecycle events and methods for app control.
 */
import { EventEmitter } from "events";
import { BrowserWindow } from "./browser-window.js";
import { Menu } from "./menu.js";
import { type NativeImage } from "./native-image.js";
import { Session, type Certificate, type ProxyConfig } from "./session.js";
import { type RenderProcessGoneDetails, type RenderProcessGoneReason, type WebContents } from "./web-contents.js";
import { type HapticFeedbackPattern } from "../ipc/native-api.js";
type AppLifecycleEventType = "before-quit" | "will-quit" | "quit";
export declare class AppEvent {
    readonly type: AppLifecycleEventType;
    defaultPrevented: boolean;
    constructor(type: AppLifecycleEventType);
    preventDefault(): void;
}
export interface AppOpenEvent {
    readonly defaultPrevented: boolean;
    preventDefault(): void;
}
export interface AppContinueActivityDetails {
    webpageURL?: string;
}
type AppLegacyOpenListener = (pathOrUrl: string) => void;
type AppElectronOpenListener = (event: AppOpenEvent, pathOrUrl: string) => void;
type AppOpenEventName = "open-file" | "open-url";
type AppLegacyActivateListener = (hasVisibleWindows: boolean) => void;
type AppElectronActivateListener = (event: AppOpenEvent, hasVisibleWindows: boolean) => void;
export type AppActivationPolicy = "regular" | "accessory" | "prohibited";
export type AppAccessibilitySupportFeature = "nativeAPIs" | "webContents" | "inlineTextBoxes" | "extendedProperties" | "screenReader" | "html" | "labelImages" | "pdfPrinting";
export interface CPUUsage {
    percentCPUUsage: number;
    cumulativeCPUUsage?: number;
    idleWakeupsPerSecond: number;
}
export interface MemoryInfo {
    workingSetSize: number;
    peakWorkingSetSize: number;
    privateBytes?: number;
}
export type ProcessMetricType = "Browser" | "Tab" | "Utility" | "Zygote" | "Sandbox helper" | "GPU" | "Pepper Plugin" | "Pepper Plugin Broker" | "Unknown";
export interface ProcessMetric {
    pid: number;
    type: ProcessMetricType;
    serviceName?: string;
    name?: string;
    cpu: CPUUsage;
    creationTime: number;
    memory: MemoryInfo;
    sandboxed?: boolean;
    integrityLevel?: "untrusted" | "low" | "medium" | "high" | "unknown";
}
export type GPUFeatureStatusValue = "disabled_software" | "disabled_off" | "disabled_off_ok" | "unavailable_software" | "unavailable_off" | "unavailable_off_ok" | "enabled_readback" | "enabled_force" | "enabled" | "enabled_on" | "enabled_force_on";
export interface GPUFeatureStatus {
    "2d_canvas": GPUFeatureStatusValue;
    flash_3d: GPUFeatureStatusValue;
    flash_stage3d: GPUFeatureStatusValue;
    flash_stage3d_baseline: GPUFeatureStatusValue;
    gpu_compositing: GPUFeatureStatusValue;
    multiple_raster_threads: GPUFeatureStatusValue;
    native_gpu_memory_buffers: GPUFeatureStatusValue;
    rasterization: GPUFeatureStatusValue;
    video_decode: GPUFeatureStatusValue;
    video_encode: GPUFeatureStatusValue;
    vpx_decode: GPUFeatureStatusValue;
    webgl: GPUFeatureStatusValue;
    webgl2: GPUFeatureStatusValue;
}
export type GPUInfoType = "basic" | "complete";
export interface AppNotificationResponse {
    actionIdentifier: string;
    date: number;
    identifier: string;
    userInfo: Record<string, unknown>;
    userText?: string;
}
export type AppReadyLaunchInfo = Record<string, unknown> | AppNotificationResponse;
export type AppCertificateTrustCallback = (isTrusted: boolean) => void;
export type AppSelectClientCertificateCallback = (certificate?: Certificate) => void;
export interface AppAuthenticationResponseDetails {
    url: URL;
    pid: number;
}
export interface AppAuthInfo {
    isProxy: boolean;
    scheme: string;
    host: string;
    port: number;
    realm: string;
}
export type AppLoginCallback = (username?: string, password?: string) => void;
export type AppChildProcessGoneType = "Utility" | "Zygote" | "Sandbox helper" | "GPU" | "Pepper Plugin" | "Pepper Plugin Broker" | "Unknown";
export interface AppChildProcessGoneDetails {
    type: AppChildProcessGoneType;
    reason: RenderProcessGoneReason;
    exitCode: number;
    serviceName?: string;
    name?: string;
}
declare class CommandLine {
    private readonly switches;
    private readonly arguments;
    constructor(argv?: string[]);
    appendSwitch(switchName: string, value?: string): void;
    appendArgument(value: string): void;
    hasSwitch(switchName: string): boolean;
    getSwitchValue(switchName: string): string;
    removeSwitch(switchName: string): void;
    private _appendArgvValue;
    private _normalizeSwitchName;
}
/**
 * Application lifecycle events
 */
export interface AppEvents {
    /**
     * Emitted when the application has finished basic startup.
     */
    "will-finish-launching": () => void;
    /**
     * Emitted once, when Glaze has finished initializing and native bridge is ready
     */
    ready: (event: AppOpenEvent, launchInfo?: AppReadyLaunchInfo) => void;
    /**
     * Emitted when all windows have been closed
     */
    "window-all-closed": () => void;
    /**
     * Emitted when the application is activated (macOS dock click)
     */
    activate: AppElectronActivateListener;
    /**
     * Emitted when the app becomes active.
     */
    "did-become-active": (event: AppOpenEvent) => void;
    /**
     * Emitted when the app resigns active state.
     */
    "did-resign-active": (event: AppOpenEvent) => void;
    /**
     * Emitted before the app continues a Handoff activity.
     */
    "will-continue-activity": (event: AppOpenEvent, type: string) => void;
    /**
     * Emitted when the app continues a Handoff activity from another device.
     */
    "continue-activity": (event: AppOpenEvent, type: string, userInfo: unknown, details: AppContinueActivityDetails) => void;
    /**
     * Emitted when a Handoff activity fails to continue.
     */
    "continue-activity-error": (event: AppOpenEvent, type: string, error: string) => void;
    /**
     * Emitted after the current Handoff activity was continued on another device.
     */
    "activity-was-continued": (event: AppOpenEvent, type: string, userInfo: unknown) => void;
    /**
     * Emitted when the current Handoff activity should update its state.
     */
    "update-activity-state": (event: AppOpenEvent, type: string, userInfo: unknown) => void;
    /**
     * Emitted before the application starts closing windows
     */
    "before-quit": (event: AppEvent) => void;
    /**
     * Emitted when the application is quitting
     */
    "will-quit": (event: AppEvent) => void;
    /**
     * Emitted when the application has finished quitting
     */
    quit: (event: AppEvent, exitCode: number) => void;
    /**
     * Emitted when a URL is opened with the app's protocol (macOS)
     */
    "open-url": AppLegacyOpenListener;
    /**
     * Emitted when a file is opened with the app (macOS)
     */
    "open-file": AppLegacyOpenListener;
    /**
     * Emitted when accessibility support state changes
     */
    "accessibility-support-changed": (event: AppOpenEvent, accessibilitySupportEnabled: boolean) => void;
    /**
     * Emitted in the primary instance when another instance asks for the single-instance lock
     */
    "second-instance": (event: AppOpenEvent, argv: string[], workingDirectory: string, additionalData: unknown) => void;
    /**
     * Emitted when a BrowserWindow is created.
     */
    "browser-window-created": (event: AppOpenEvent, window: BrowserWindow) => void;
    /**
     * Emitted when a BrowserWindow gets focused.
     */
    "browser-window-focus": (event: AppOpenEvent, window: BrowserWindow) => void;
    /**
     * Emitted when a BrowserWindow gets blurred.
     */
    "browser-window-blur": (event: AppOpenEvent, window: BrowserWindow) => void;
    /**
     * Emitted when the native macOS tab bar asks the app to create a new tab window.
     */
    "new-window-for-tab": (event: AppOpenEvent) => void;
    /**
     * Emitted when a WebContents is created.
     */
    "web-contents-created": (event: AppOpenEvent, webContents: WebContents) => void;
    /**
     * Emitted when a certificate could not be verified.
     */
    "certificate-error": (event: AppOpenEvent, webContents: WebContents, url: string, error: string, certificate: Certificate, callback: AppCertificateTrustCallback, isMainFrame: boolean) => void;
    /**
     * Emitted when a client certificate is requested.
     */
    "select-client-certificate": (event: AppOpenEvent, webContents: WebContents, url: URL, certificateList: Certificate[], callback: AppSelectClientCertificateCallback) => void;
    /**
     * Emitted when WebContents or a utility process requests basic authentication.
     */
    login: (event: AppOpenEvent, webContents: WebContents | undefined, authenticationResponseDetails: AppAuthenticationResponseDetails, authInfo: AppAuthInfo, callback: AppLoginCallback) => void;
    /**
     * Emitted when a renderer process disappears.
     */
    "render-process-gone": (event: AppOpenEvent, webContents: WebContents, details: RenderProcessGoneDetails) => void;
    /**
     * Emitted when a non-renderer child process disappears.
     */
    "child-process-gone": (event: AppOpenEvent, details: AppChildProcessGoneDetails) => void;
    /**
     * Emitted when a Session is created.
     */
    "session-created": (session: Session) => void;
    /**
     * Emitted when GPU information has been initialized or updated.
     */
    "gpu-info-update": () => void;
}
export declare function createAppOpenEvent(): AppOpenEvent;
/**
 * Path name type for app.getPath()
 */
export type PathName = "home" | "appData" | "userData" | "sessionData" | "sharedUserData" | "temp" | "exe" | "module" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "logs" | "crashDumps" | "cache";
/**
 * Login item settings
 */
export type LoginItemServiceType = "mainAppService" | "agentService" | "daemonService" | "loginItemService";
export interface LoginItemSettingsOptions {
    type?: LoginItemServiceType;
    serviceName?: string;
    path?: string;
    args?: string[];
}
export interface SetLoginItemSettings extends LoginItemSettingsOptions {
    openAtLogin?: boolean;
    openAsHidden?: boolean;
    enabled?: boolean;
    name?: string;
}
export interface LoginItemLaunchItem {
    name: string;
    path: string;
    args: string[];
    scope: "user" | "machine";
    enabled: boolean;
}
export interface LoginItemSettings {
    openAtLogin: boolean;
    openAsHidden: boolean;
    wasOpenedAtLogin: boolean;
    wasOpenedAsHidden: boolean;
    restoreState: boolean;
    status?: "not-registered" | "enabled" | "requires-approval" | "not-found";
    executableWillLaunchAtLogin?: boolean;
    launchItems?: LoginItemLaunchItem[];
}
export interface RelaunchOptions {
    args?: string[];
    execPath?: string;
}
export interface AppFileIconOptions {
    /** `small` is 16 pt, `normal` is 32 pt, and `large` is 128 pt. */
    size?: "small" | "normal" | "large";
}
type DockBounceType = "critical" | "informational";
export interface AppApplicationInfoForProtocol {
    icon: NativeImage;
    path: string;
    name: string;
}
export interface AppAboutPanelOptions {
    applicationName?: string;
    applicationVersion?: string;
    copyright?: string;
    version?: string;
    credits?: string;
    authors?: string[];
    website?: string;
    iconPath?: string;
}
export type AppHostResolverSecureDnsMode = "off" | "automatic" | "secure";
export interface AppConfigureHostResolverOptions {
    enableBuiltInResolver?: boolean;
    enableHappyEyeballs?: boolean;
    secureDnsMode?: AppHostResolverSecureDnsMode;
    secureDnsServers?: string[];
    enableAdditionalDnsQueryTypes?: boolean;
}
export interface AppConfigureWebAuthnTouchIDOptions {
    keychainAccessGroup: string;
    promptReason?: string;
}
export interface AppConfigureWebAuthnOptions {
    touchID?: AppConfigureWebAuthnTouchIDOptions;
}
/**
 * Dock API (macOS)
 */
declare class Dock {
    private readonly getIsAppActive;
    private static readonly hideAfterShowSuppressionMs;
    private _isVisible;
    private _badge;
    private _menu;
    private _lastShowStartedAt;
    private _nextBounceId;
    private _pendingBounceIds;
    private _nativeBounceIds;
    private _pendingCanceledBounceIds;
    constructor(getIsAppActive?: () => boolean);
    /**
     * Hide the dock icon
     */
    hide(): void;
    /** @deprecated Use `hide()` for the synchronous void API shape. */
    hideAsync(): Promise<void>;
    /**
     * Show the dock icon
     */
    show(): Promise<void>;
    /**
     * Check if dock icon is visible
     */
    isVisible(): boolean;
    /** @deprecated Use `isVisible()` for the synchronous cached visibility state. */
    isVisibleAsync(): Promise<boolean>;
    private _shouldSuppressHideAfterRecentShow;
    /**
     * Bounce the dock icon
     * @param type - 'critical' (bounces until app focused) or 'informational' (bounces once)
     * @returns Request ID for cancelBounce
     */
    bounce(type?: DockBounceType): number;
    /** @deprecated Use `bounce()` for the synchronous local request id. */
    bounceAsync(type?: DockBounceType): Promise<number>;
    /**
     * Cancel a dock bounce
     */
    cancelBounce(id: number): void;
    /** @deprecated Use `cancelBounce()` for the synchronous void API shape. */
    cancelBounceAsync(id: number): Promise<void>;
    /**
     * Set the dock badge text
     */
    setBadge(text: string): void;
    /** @deprecated Use `setBadge()` for the synchronous void API shape. */
    setBadgeAsync(text: string): Promise<void>;
    /**
     * Get the dock badge text
     */
    getBadge(): string;
    /** @deprecated Use `getBadge()` for the synchronous cached badge text. */
    getBadgeAsync(): Promise<string>;
    /**
     * Notify the Dock that a download finished.
     */
    downloadFinished(filePath: string): void;
    /**
     * Set the Dock context menu.
     */
    setMenu(menu: Menu): void;
    /**
     * Get the Dock context menu.
     */
    getMenu(): Menu | null;
    /**
     * Set the Dock icon.
     */
    setIcon(image: NativeImage | string): void;
    private _serializeDockIcon;
    private _normalizeMenu;
    private _normalizeBounceType;
}
/**
 * App - Application lifecycle management
 *
 * Exposes application lifecycle and metadata helpers.
 */
declare class App extends EventEmitter {
    private _readyPromise;
    private _readyResolver;
    private _isQuitting;
    private _quitPromise;
    private _name;
    private _pendingOpenEvents;
    private _pathOverrides;
    private _secureKeyboardEntryEnabled;
    private _badgeCount;
    private _accessibilitySupportFeatures;
    private _singleInstanceLock;
    private _singleInstanceExitCleanupInstalled;
    private get _isReady();
    private set _isReady(value);
    private _currentActivityType;
    private _runningUnderARM64Translation;
    private _didResolveRunningUnderARM64Translation;
    private _hardwareAccelerationEnabled;
    private _domainBlockingFor3DAPIsDisabled;
    private _sandboxEnabled;
    private _hostResolverConfig;
    private _webAuthnConfig;
    private _lastAppMetricsCpuUsage;
    private _lastAppMetricsTimestamp;
    private _didReadAppMetrics;
    private _recentDocuments;
    private _isAppActive;
    private _isAppHidden;
    private _loginItemSettings;
    private _loginItemSettingsByKey;
    /**
     * macOS Dock API
     */
    private readonly _dock;
    get dock(): Dock;
    /**
     * Command-line switch compatibility state.
     */
    readonly commandLine: CommandLine;
    /**
     * The application menu, if one has been set.
     */
    get applicationMenu(): Menu | null;
    set applicationMenu(menu: Menu | null);
    /**
     * The current application name.
     */
    get name(): string;
    private _getName;
    set name(name: string);
    /**
     * The current app badge count.
     */
    get badgeCount(): number;
    set badgeCount(count: number);
    /**
     * User agent string used for new windows without an explicit user agent.
     */
    get userAgentFallback(): string;
    set userAgentFallback(userAgent: string);
    /**
     * Whether accessibility support is enabled for app content.
     */
    get accessibilitySupportEnabled(): boolean;
    set accessibilitySupportEnabled(enabled: boolean);
    /**
     * Whether the current process is running under ARM64 translation.
     */
    get runningUnderARM64Translation(): boolean | undefined;
    private _getRunningUnderARM64Translation;
    constructor();
    /**
     * Returns a Promise that resolves when the app is ready
     *
     * @example
     * ```typescript
     * const { app, BrowserWindow } = require('@glaze/core/backend');
     *
     * app.whenReady().then(() => {
     *   const win = new BrowserWindow({ width: 800, height: 600 });
     *   win.loadFile('index.html');
     * });
     * ```
     */
    whenReady(): Promise<void>;
    /**
     * Check if the app is ready
     */
    isReady(): boolean;
    /**
     * Mark the app as ready (called internally when native bridge connects)
     * @internal
     */
    _markReady(): void;
    /**
     * Quit the application
     */
    quit(): void;
    private _quitGracefully;
    private _cancelQuit;
    private _emitLifecycleEvent;
    /**
     * Check if the app is quitting
     */
    isQuitting(): boolean;
    /**
     * Notify that all windows were closed
     * @internal
     */
    _notifyAllWindowsClosed(): void;
    /**
     * Notify that app was activated (dock click on macOS)
     * @internal
     */
    _notifyActivate(hasVisibleWindows: boolean): void;
    /**
     * Notify that app became active (macOS)
     * @internal
     */
    _notifyDidBecomeActive(): void;
    /**
     * Notify that app resigned active state (macOS)
     * @internal
     */
    _notifyDidResignActive(): void;
    _notifyWillContinueActivity(type: string): boolean;
    _notifyContinueActivity(type: string, userInfo: unknown, details: AppContinueActivityDetails): boolean;
    _notifyContinueActivityError(type: string, error: string): void;
    _notifyActivityWasContinued(type: string, userInfo: unknown): void;
    _notifyUpdateActivityState(type: string, userInfo: unknown): boolean;
    /**
     * Notify that a file should be opened (macOS file association).
     * Files received before app is ready are queued and delivered before ready listeners run.
     * @internal
     */
    _notifyOpenFile(path: string): void;
    /**
     * Notify that a URL should be opened (macOS custom URL schemes).
     * URLs received before app is ready are queued and delivered before ready listeners run.
     * @internal
     */
    _notifyOpenUrl(url: string): void;
    /**
     * Flush pending launch open events before app is ready.
     * @internal
     */
    private _flushPendingOpenEvents;
    private _emitOpenEvent;
    private _emitActivateEvent;
    /**
     * Get the application name
     */
    getName(): string;
    /** @deprecated Use `getName()` for the cached synchronous application name. */
    getNameAsync(): Promise<string>;
    /**
     * Set the application name (for display purposes)
     */
    setName(name: string): void;
    /**
     * Get the application version
     */
    getVersion(): string;
    /** @deprecated Use `getVersion()` for the cached synchronous application version. */
    getVersionAsync(): Promise<string>;
    /**
     * Get the first custom URL scheme registered by the app bundle.
     */
    getUrlScheme(): Promise<string>;
    /**
     * Get the application root path.
     */
    getAppPath(): string;
    /**
     * Get the app root directory — where the app's package.json lives.
     * Stable across development and installed apps; use it to resolve files
     * relative to the app source instead of hand-building paths from __dirname.
     * Equivalent to {@link getAppPath}; prefer this name in new code.
     */
    getAppRootPath(): string;
    /**
     * Override a special path returned by getPath().
     */
    setPath(name: PathName, path: string): void;
    /**
     * Set or create the app logs path.
     */
    setAppLogsPath(path?: string): void;
    /**
     * Get a special directory or file path
     * @param name - Path name ('home', 'appData', 'userData', 'temp', 'desktop', 'documents', etc.)
     */
    getPath(name: PathName): string;
    /** @deprecated Use `getPath()` for the synchronous path lookup. */
    getPathAsync(name: PathName): Promise<string>;
    /**
     * Get the native icon associated with a file path, including 1x and 2x representations.
     */
    getFileIcon(path: string, options?: AppFileIconOptions): Promise<NativeImage>;
    private _defaultLogsPath;
    private _resolveSpecialPath;
    private _getBundleIdentifier;
    private _getBundleExecutablePath;
    private _getMainAppBundleIdentifier;
    private _readBundleInfoString;
    private _getCurrentBundleIdentifier;
    private _readPackageDisplayName;
    private _readPackageVersion;
    private _getRuntimeLocale;
    private _getRuntimeLocaleCountryCode;
    private _getRuntimeSystemLocale;
    private _getRuntimePreferredSystemLanguages;
    private _readGlobalPreferenceString;
    private _readGlobalPreferenceJSON;
    private _readGlobalPreference;
    private _detectRunningUnderARM64Translation;
    private _ensureReadyForAccessibilitySupport;
    private _ensureReadyForHostResolver;
    private _ensureReadyForProxy;
    private _ensureBeforeReady;
    private _normalizeHostResolverConfig;
    private _normalizeWebAuthnConfig;
    private _setAccessibilitySupportFeatures;
    private _getSingleInstanceLockPaths;
    private _createSingleInstanceLock;
    private _handleSecondInstanceSocket;
    private _sendSecondInstanceMessage;
    private _serializeSingleInstanceAdditionalData;
    private _deserializeSingleInstanceAdditionalData;
    private _readSingleInstanceLockInfo;
    private _removeSingleInstanceLockIfStale;
    private _removeFileIfExists;
    private _isProcessAlive;
    private _getApplicationBundlePath;
    private _resolvePath;
    /**
     * Get the current locale
     */
    getLocale(): string;
    /** @deprecated Use `getLocale()` for the synchronous application locale. */
    getLocaleAsync(): Promise<string>;
    /**
     * Get the locale country code
     */
    getLocaleCountryCode(): string;
    /** @deprecated Use `getLocaleCountryCode()` for the synchronous country code. */
    getLocaleCountryCodeAsync(): Promise<string>;
    /**
     * Get the current system locale.
     */
    getSystemLocale(): string;
    /** @deprecated Use `getSystemLocale()` for the synchronous system locale. */
    getSystemLocaleAsync(): Promise<string>;
    /**
     * Get the user's preferred system languages.
     */
    getPreferredSystemLanguages(): string[];
    /** @deprecated Use `getPreferredSystemLanguages()` for the synchronous preferred language list. */
    getPreferredSystemLanguagesAsync(): Promise<string[]>;
    /**
     * Add a file path to the OS-managed recent documents list.
     */
    addRecentDocument(path: string): void;
    /**
     * Clear the OS-managed recent documents list.
     */
    clearRecentDocuments(): void;
    /**
     * Get the cached recent documents list.
     */
    getRecentDocuments(): string[];
    /** @deprecated Use `getRecentDocuments()` for the synchronous cached list. */
    getRecentDocumentsAsync(): Promise<string[]>;
    /**
     * Set this app as the default handler for a URL scheme.
     */
    setAsDefaultProtocolClient(protocol: string, path?: string, args?: string[]): Promise<boolean>;
    /**
     * Remove this app as the default handler for a URL scheme.
     */
    removeAsDefaultProtocolClient(protocol: string, path?: string, args?: string[]): Promise<boolean>;
    /**
     * Check whether this app is the default handler for a URL scheme.
     */
    isDefaultProtocolClient(protocol: string, _path?: string, _args?: string[]): boolean;
    /** @deprecated Use `isDefaultProtocolClient()` for Electron-compatible synchronous reads. */
    isDefaultProtocolClientAsync(protocol: string, path?: string, args?: string[]): Promise<boolean>;
    /**
     * Get the display name for the app handling a URL.
     */
    getApplicationNameForProtocol(url: string): string;
    /** @deprecated Use `getApplicationNameForProtocol()` for Electron-compatible synchronous reads. */
    getApplicationNameForProtocolAsync(url: string): Promise<string>;
    /**
     * Get app information for the app handling a URL.
     */
    getApplicationInfoForProtocol(url: string): Promise<AppApplicationInfoForProtocol>;
    setProxy(config: ProxyConfig): Promise<void>;
    resolveProxy(url: string | URL): Promise<string>;
    /**
     * Configure host resolution policy.
     *
     * Glaze stores this Electron-shaped policy for compatibility. The current
     * WebKit/Node networking stack does not consume it yet.
     */
    configureHostResolver(options: AppConfigureHostResolverOptions): void;
    /**
     * Configure Web Authentication platform authenticator policy.
     *
     * Glaze stores this Electron-shaped policy for compatibility. The current
     * WebKit runtime does not yet enable Touch ID credentials from this setting.
     */
    configureWebAuthn(options: AppConfigureWebAuthnOptions): void;
    /**
     * Disable Chromium-style hardware acceleration before the app is ready.
     */
    disableHardwareAcceleration(): void;
    /**
     * Return the app-owned hardware acceleration compatibility state.
     */
    isHardwareAccelerationEnabled(): boolean;
    /**
     * Return a Chromium-shaped GPU feature status placeholder.
     */
    getGPUFeatureStatus(): GPUFeatureStatus;
    /**
     * Return placeholder GPU diagnostics for compatibility.
     */
    getGPUInfo(infoType: GPUInfoType): Promise<unknown>;
    /**
     * Disable Chromium's 3D API domain-blocking behavior before the app is ready.
     */
    disableDomainBlockingFor3DAPIs(): void;
    /**
     * Enable sandbox compatibility mode for future renderer processes.
     */
    enableSandbox(): void;
    _getHostResolverConfigForTesting(): AppConfigureHostResolverOptions;
    _getWebAuthnConfigForTesting(): AppConfigureWebAuthnOptions;
    _isDomainBlockingFor3DAPIsDisabledForTesting(): boolean;
    _isSandboxEnabledForTesting(): boolean;
    /**
     * Return memory and CPU metrics for the backend process.
     */
    getAppMetrics(): ProcessMetric[];
    /**
     * Request the app's single-instance lock.
     */
    requestSingleInstanceLock(additionalData?: unknown): boolean;
    /**
     * Whether this process currently owns the single-instance lock.
     */
    hasSingleInstanceLock(): boolean;
    /**
     * Release the single-instance lock for this process.
     */
    releaseSingleInstanceLock(): void;
    /**
     * Create and make current an NSUserActivity-compatible activity.
     */
    setUserActivity(type: string, userInfo: Record<string, unknown>, webpageURL?: string): void;
    /**
     * Return the current user activity type.
     */
    getCurrentActivityType(): string;
    /**
     * Invalidate and clear the current user activity.
     */
    invalidateCurrentActivity(): void;
    /**
     * Mark the current user activity inactive without invalidating it.
     */
    resignCurrentActivity(): void;
    /**
     * Update the current user activity if the activity type matches.
     */
    updateCurrentActivity(type: string, userInfo: Record<string, unknown>): void;
    /**
     * Whether the current macOS app bundle is inside an Applications directory.
     */
    isInApplicationsFolder(): boolean;
    /**
     * Show the native About panel.
     */
    showAboutPanel(): void;
    /**
     * Set native About panel options.
     */
    setAboutPanelOptions(options: AppAboutPanelOptions): void;
    /**
     * Check whether the current platform supports a native emoji panel.
     */
    isEmojiPanelSupported(): boolean;
    /**
     * Show the native emoji panel.
     */
    showEmojiPanel(): void;
    /**
     * Set the app activation policy on macOS.
     */
    setActivationPolicy(policy: AppActivationPolicy): void;
    /**
     * Check whether this app has enabled secure keyboard entry.
     */
    isSecureKeyboardEntryEnabled(): boolean;
    /**
     * Enable or disable secure keyboard entry for this app.
     */
    setSecureKeyboardEntryEnabled(enabled: boolean): void;
    /**
     * Returns whether Electron-style accessibility support has been fully enabled.
     */
    isAccessibilitySupportEnabled(): boolean;
    /**
     * Manually enable or disable Electron-style accessibility support state.
     */
    setAccessibilitySupportEnabled(enabled: boolean): void;
    /**
     * Return the currently enabled Electron accessibility support feature names.
     */
    getAccessibilitySupportFeatures(): AppAccessibilitySupportFeature[];
    /**
     * Manually set the enabled Electron accessibility support feature names.
     */
    setAccessibilitySupportFeatures(features: readonly AppAccessibilitySupportFeature[]): void;
    /**
     * Whether the app is running from a packaged build (Electron-compatible boolean property).
     *
     * The authoritative value is computed by the native host and injected as the
     * `GLAZE_IS_PACKAGED` environment variable at backend launch (see `NodeBackend.environment`
     * / `AppIsPackagedMethod`), so this is synchronously correct from process start with no
     * IPC round-trip. Use `isPackagedAsync()` to query the native layer directly.
     */
    get isPackaged(): boolean;
    /** Async accessor that queries the native layer directly (round-trip). */
    isPackagedAsync(): Promise<boolean>;
    private _isPackagedNative;
    /**
     * Focus the application
     * @param options.steal - Whether to steal focus from other apps
     */
    focus(options?: {
        steal?: boolean;
    }): void;
    /** @deprecated Use `focus()` for the synchronous void API shape. */
    focusAsync(options?: {
        steal?: boolean;
    }): Promise<void>;
    /**
     * Check whether the application is currently active.
     */
    isActive(): boolean;
    /** @deprecated Use `isActive()` for the synchronous cached active state. */
    isActiveAsync(): Promise<boolean>;
    /**
     * Hide the application (macOS)
     */
    hide(): void;
    /** @deprecated Use `hide()` for the synchronous void API shape. */
    hideAsync(): Promise<void>;
    /**
     * Check whether the application is hidden.
     */
    isHidden(): boolean;
    /** @deprecated Use `isHidden()` for the synchronous cached hidden state. */
    isHiddenAsync(): Promise<boolean>;
    /**
     * Show the application (macOS)
     */
    show(): void;
    /** @deprecated Use `show()` for the synchronous void API shape. */
    showAsync(): Promise<void>;
    /**
     * Set the dock badge count
     * @param count - Badge count (0 to clear)
     */
    setBadgeCount(count?: number): boolean;
    /** @deprecated Use `setBadgeCount()` for the synchronous boolean API shape. */
    setBadgeCountAsync(count?: number): Promise<boolean>;
    /**
     * Get the dock badge count
     */
    getBadgeCount(): number;
    /** @deprecated Use `getBadgeCount()` for the synchronous badge count. */
    getBadgeCountAsync(): Promise<number>;
    /**
     * Trigger a macOS haptic feedback pulse on the trackpad / Force Touch surface.
     *
     * @param pattern - "alignment" | "generic" | "level-change". Maps to
     *   NSHapticFeedbackManager.FeedbackPattern.
     */
    performHapticFeedback(pattern?: HapticFeedbackPattern): Promise<void>;
    /**
     * Relaunch the application
     * @param options.args - Command line arguments for new instance
     * @param options.execPath - Executable path for new instance
     */
    relaunch(options?: RelaunchOptions): void;
    /**
     * Exit the application immediately (no events fired)
     * @param exitCode - Exit code (default: 0)
     */
    exit(exitCode?: number): void;
    /**
     * Set login item settings (launch at login)
     */
    setLoginItemSettings(settings: SetLoginItemSettings): void;
    /** @deprecated Use `setLoginItemSettings()` for the synchronous void API shape. */
    setLoginItemSettingsAsync(settings: SetLoginItemSettings): Promise<void>;
    /**
     * Get login item settings
     */
    getLoginItemSettings(options?: LoginItemSettingsOptions): LoginItemSettings;
    /** @deprecated Use `getLoginItemSettings()` for the synchronous cached settings. */
    getLoginItemSettingsAsync(options?: LoginItemSettingsOptions): Promise<LoginItemSettings>;
    private _applyLoginItemSettings;
    private _ensureLoginItemServiceName;
    private _getCachedLoginItemSettings;
    private _setCachedLoginItemSettings;
    private _loginItemCacheKey;
    private _normalizeLoginItemSettings;
    on(event: AppOpenEventName, listener: AppLegacyOpenListener): this;
    on(event: AppOpenEventName, listener: AppElectronOpenListener): this;
    on(event: "activate", listener: AppLegacyActivateListener): this;
    on(event: "activate", listener: AppElectronActivateListener): this;
    on<K extends Exclude<keyof AppEvents, AppOpenEventName | "activate">>(event: K, listener: AppEvents[K]): this;
    once(event: AppOpenEventName, listener: AppLegacyOpenListener): this;
    once(event: AppOpenEventName, listener: AppElectronOpenListener): this;
    once(event: "activate", listener: AppLegacyActivateListener): this;
    once(event: "activate", listener: AppElectronActivateListener): this;
    once<K extends Exclude<keyof AppEvents, AppOpenEventName | "activate">>(event: K, listener: AppEvents[K]): this;
    off(event: AppOpenEventName, listener: AppLegacyOpenListener): this;
    off(event: AppOpenEventName, listener: AppElectronOpenListener): this;
    off(event: "activate", listener: AppLegacyActivateListener): this;
    off(event: "activate", listener: AppElectronActivateListener): this;
    off<K extends Exclude<keyof AppEvents, AppOpenEventName | "activate">>(event: K, listener: AppEvents[K]): this;
    emit<K extends keyof AppEvents>(event: K, ...args: Parameters<AppEvents[K]>): boolean;
}
/**
 * Singleton app instance
 */
export declare const app: App;
export {};
