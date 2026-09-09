import { EventEmitter } from "events";
import { DownloadItem } from "./download-item.js";
import { Extensions, type Extension } from "./extensions.js";
import { type GlazeIPCServer } from "./ipc.js";
import { NetLog } from "./net-log.js";
import { type Protocol } from "./protocol.js";
import { ServiceWorkers } from "./service-workers.js";
import { type WebContents } from "./web-contents.js";
import { WebFrameMain } from "./web-frame-main.js";
import { WebRequest } from "./web-request.js";
export type CookieSameSite = "unspecified" | "no_restriction" | "lax" | "strict";
export interface Cookie {
    name: string;
    value: string;
    domain: string;
    hostOnly: boolean;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    session: boolean;
    expirationDate?: number;
    sameSite?: CookieSameSite;
}
export interface CookiesGetFilter {
    url?: string;
    name?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    session?: boolean;
    httpOnly?: boolean;
}
export interface CookiesSetDetails {
    url: string;
    name?: string;
    value?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    expirationDate?: number;
    sameSite?: CookieSameSite;
}
export type CookiesChangedCause = "inserted" | "inserted-no-change-overwrite" | "inserted-no-value-change-overwrite" | "explicit" | "overwrite" | "expired" | "evicted" | "expired-overwrite" | "unknown";
export interface CookiesEvents {
    changed: (event: Event, cookie: Cookie, cause: CookiesChangedCause, removed: boolean) => void;
}
export interface DownloadURLOptions {
    headers?: Record<string, string>;
}
interface InternalDownloadMetadata {
    suggestedFilename?: string;
}
export interface WebAuthnAccount {
    credentialId: string;
    userHandle?: string;
    name?: string;
    displayName?: string;
}
export interface SessionSelectWebAuthnAccountDetails {
    relyingPartyId: string;
    accounts: WebAuthnAccount[];
    frame: WebFrameMain | null;
}
export type SessionSelectWebAuthnAccountCallback = (credentialId?: string | null) => void;
export type SessionFileSystemAccessRestrictedAction = "allow" | "deny" | "tryAgain";
export interface SessionFileSystemAccessRestrictedDetails {
    origin: string;
    isDirectory: boolean;
    path: string;
}
export type SessionFileSystemAccessRestrictedCallback = (action: SessionFileSystemAccessRestrictedAction) => void;
export interface SessionHIDDeviceDetails {
    device: HIDDevice;
    frame: WebFrameMain | null;
}
export interface SessionSelectHIDDeviceDetails {
    deviceList: HIDDevice[];
    frame: WebFrameMain | null;
}
export type SessionSelectHIDDeviceCallback = (deviceId?: string | null) => void;
export interface SessionHIDDeviceRevokedDetails {
    device: HIDDevice;
    origin?: string;
}
export type SessionSelectSerialPortCallback = (portId: string) => void;
export interface SessionSerialPortRevokedDetails {
    port: SerialPort;
    frame: WebFrameMain | null;
    origin: string;
}
export interface SessionSelectUSBDeviceDetails {
    deviceList: USBDevice[];
    frame: WebFrameMain | null;
}
export type SessionSelectUSBDeviceCallback = (deviceId?: string) => void;
export interface SessionUSBDeviceRevokedDetails {
    device: USBDevice;
    origin?: string;
}
export interface SessionEvents {
    "will-download": (event: Event, item: DownloadItem, webContents: WebContents | null) => void;
    "file-system-access-restricted": (event: Event, details: SessionFileSystemAccessRestrictedDetails, callback: SessionFileSystemAccessRestrictedCallback) => void;
    preconnect: (event: Event, preconnectUrl: string, allowCredentials: boolean) => void;
    "spellcheck-dictionary-initialized": (event: Event, languageCode: string) => void;
    "spellcheck-dictionary-download-begin": (event: Event, languageCode: string) => void;
    "spellcheck-dictionary-download-success": (event: Event, languageCode: string) => void;
    "spellcheck-dictionary-download-failure": (event: Event, languageCode: string) => void;
    "select-hid-device": (event: Event, details: SessionSelectHIDDeviceDetails, callback: SessionSelectHIDDeviceCallback) => void;
    "hid-device-added": (event: Event, details: SessionHIDDeviceDetails) => void;
    "hid-device-removed": (event: Event, details: SessionHIDDeviceDetails) => void;
    "hid-device-revoked": (event: Event, details: SessionHIDDeviceRevokedDetails) => void;
    "select-serial-port": (event: Event, portList: SerialPort[], webContents: WebContents, callback: SessionSelectSerialPortCallback) => void;
    "serial-port-added": (event: Event, port: SerialPort, webContents: WebContents) => void;
    "serial-port-removed": (event: Event, port: SerialPort, webContents: WebContents) => void;
    "serial-port-revoked": (event: Event, details: SessionSerialPortRevokedDetails) => void;
    "select-usb-device": (event: Event, details: SessionSelectUSBDeviceDetails, callback: SessionSelectUSBDeviceCallback) => void;
    "usb-device-added": (event: Event, device: USBDevice, webContents: WebContents) => void;
    "usb-device-removed": (event: Event, device: USBDevice, webContents: WebContents) => void;
    "usb-device-revoked": (event: Event, details: SessionUSBDeviceRevokedDetails) => void;
    "select-webauthn-account": (event: Event, details: SessionSelectWebAuthnAccountDetails, callback: SessionSelectWebAuthnAccountCallback) => void;
    "extension-loaded": (event: Event, extension: Extension) => void;
    "extension-unloaded": (event: Event, extension: Extension) => void;
    "extension-ready": (event: Event, extension: Extension) => void;
}
export interface SessionClearStorageDataOptions {
    origin?: string;
    storages?: Array<"appcache" | "cookies" | "filesystem" | "indexdb" | "localstorage" | "sessionstorage" | "shadercache" | "websql" | "serviceworkers" | "cachestorage">;
    quotas?: Array<"temporary">;
}
export type SessionClearDataType = "backgroundFetch" | "cache" | "cookies" | "downloads" | "fileSystems" | "indexedDB" | "localStorage" | "serviceWorkers" | "webSQL";
export interface SessionClearDataOptions {
    dataTypes?: SessionClearDataType[];
    origins?: string[];
    excludeOrigins?: string[];
    avoidClosingConnections?: boolean;
    originMatchingMode?: "third-parties-included" | "origin-in-all-contexts";
}
export interface FromPartitionOptions {
    cache?: boolean;
}
export interface FromPathOptions {
    cache?: boolean;
}
export type SessionResolveHostQueryType = "A" | "AAAA";
export type SessionResolveHostSource = "any" | "system" | "dns" | "mdns" | "localOnly";
export type SessionResolveHostCacheUsage = "allowed" | "staleAllowed" | "disallowed";
export type SessionResolveHostSecureDnsPolicy = "allow" | "disable";
export interface SessionResolveHostOptions {
    queryType?: SessionResolveHostQueryType;
    source?: SessionResolveHostSource;
    cacheUsage?: SessionResolveHostCacheUsage;
    secureDnsPolicy?: SessionResolveHostSecureDnsPolicy;
}
export type SessionResolvedEndpointFamily = "ipv4" | "ipv6" | "unspec";
export interface SessionResolvedEndpoint {
    address: string;
    family: SessionResolvedEndpointFamily;
}
export interface SessionResolvedHost {
    endpoints: SessionResolvedEndpoint[];
}
export type SessionFetchBody = BodyInit | Buffer;
export type SessionFetchInit = Omit<RequestInit, "body"> & {
    body?: SessionFetchBody | null;
    bypassCustomProtocolHandlers?: boolean;
};
export interface SessionNetworkEmulationOptions {
    offline?: boolean;
    latency?: number;
    downloadThroughput?: number;
    uploadThroughput?: number;
}
export type ProxyMode = "direct" | "auto_detect" | "pac_script" | "fixed_servers" | "system";
export interface ProxyConfig {
    mode?: ProxyMode;
    pacScript?: string;
    proxyRules?: string;
    proxyBypassRules?: string;
}
export interface SessionPreconnectOptions {
    url: string;
    numSockets?: number;
}
export type SessionSSLMinVersion = "tls1" | "tls1.1" | "tls1.2" | "tls1.3";
export type SessionSSLMaxVersion = "tls1.2" | "tls1.3";
export interface SessionSSLConfig {
    minVersion?: SessionSSLMinVersion;
    maxVersion?: SessionSSLMaxVersion;
    disabledCipherSuites?: number[];
}
export interface CertificatePrincipal {
    commonName: string;
    organizations: string[];
    organizationUnits: string[];
    locality: string;
    state: string;
    country: string;
}
export interface Certificate {
    data: string;
    issuer: CertificatePrincipal;
    issuerName: string;
    issuerCert?: Certificate;
    subject: CertificatePrincipal;
    subjectName: string;
    serialNumber: string;
    validStart: number;
    validExpiry: number;
    fingerprint: string;
}
export interface CertificateVerifyProcRequest {
    hostname: string;
    certificate: Certificate;
    validatedCertificate: Certificate;
    isIssuedByKnownRoot: boolean;
    verificationResult: string;
    errorCode: number;
}
export type CertificateVerifyProc = (request: CertificateVerifyProcRequest, callback: (verificationResult: number) => void) => void;
export type PreloadScriptType = "frame" | "service-worker";
export interface PreloadScriptRegistration {
    type: PreloadScriptType;
    id?: string;
    filePath: string;
}
export interface PreloadScript {
    type: PreloadScriptType;
    id: string;
    filePath: string;
}
export interface SessionClearCodeCachesOptions {
    urls?: string[];
}
export interface CreateInterruptedDownloadOptions {
    path: string;
    urlChain: string[];
    mimeType?: string;
    offset: number;
    length: number;
    lastModified?: string;
    eTag?: string;
    startTime?: number;
}
export interface SharedDictionaryIsolationKey {
    frameOrigin: string;
    topFrameSite: string;
}
export interface SharedDictionaryUsageInfo extends SharedDictionaryIsolationKey {
    totalSizeBytes: number;
}
export interface SharedDictionaryInfo {
    match: string;
    matchDestinations: string[];
    id: string;
    dictionaryUrl: string;
    lastFetchTime: Date;
    responseTime: Date;
    expirationDuration: number;
    lastUsedTime: Date;
    size: number;
    hash: string;
}
export interface DisplayMediaRequest {
    frame: WebFrameMain | null;
    securityOrigin: string;
    videoRequested: boolean;
    audioRequested: boolean;
    userGesture: boolean;
}
export interface DisplayMediaSource {
    id: string;
    name: string;
}
export interface DisplayMediaStreams {
    video?: DisplayMediaSource | WebFrameMain;
    audio?: DisplayMediaSource | string | WebFrameMain;
    enableLocalEcho?: boolean;
}
export type DisplayMediaRequestHandler = (request: DisplayMediaRequest, callback: (streams?: DisplayMediaStreams | null) => void) => void;
export interface DisplayMediaRequestHandlerOptions {
    useSystemPicker?: boolean;
}
export interface DisplayMediaStreamSelection {
    id: string;
    name: string;
}
export interface DisplayMediaStreamSelections {
    video?: DisplayMediaStreamSelection;
    audio?: DisplayMediaStreamSelection | string;
    enableLocalEcho?: boolean;
}
export interface DisplayMediaRequestDecision {
    handled: boolean;
    streams: DisplayMediaStreamSelections | null;
    error?: string;
}
export interface HIDDevice {
    deviceId: string;
    name: string;
    vendorId: number;
    productId: number;
    serialNumber?: string;
    guid?: string;
    collections: Array<Record<string, unknown>>;
}
export interface SerialPort {
    portId: string;
    portName: string;
    displayName?: string;
    vendorId?: string;
    productId?: string;
    serialNumber?: string;
    usbDriverName?: string;
    deviceInstanceId?: string;
}
export interface USBDevice {
    deviceId: string;
    vendorId: number;
    productId: number;
    productName?: string;
    manufacturerName?: string;
    serialNumber?: string;
    deviceClass: number;
    deviceSubclass: number;
    deviceProtocol: number;
    deviceVersionMajor: number;
    deviceVersionMinor: number;
    deviceVersionSubminor: number;
    usbVersionMajor: number;
    usbVersionMinor: number;
    usbVersionSubminor: number;
    configurations?: Array<Record<string, unknown>>;
    configuration?: Record<string, unknown>;
}
export type DevicePermissionDeviceType = "hid" | "serial" | "usb";
export interface DevicePermissionHandlerDetails {
    deviceType: DevicePermissionDeviceType;
    origin: string;
    device: HIDDevice | SerialPort | USBDevice;
}
export type DevicePermissionHandler = (details: DevicePermissionHandlerDetails) => boolean;
export type USBProtectedClass = "audio" | "audio-video" | "hid" | "mass-storage" | "smart-card" | "video" | "wireless";
export interface USBProtectedClassesHandlerDetails {
    protectedClasses: USBProtectedClass[];
}
export type USBProtectedClassesHandler = (details: USBProtectedClassesHandlerDetails) => USBProtectedClass[];
export type SessionPermissionRequestType = "clipboard-read" | "clipboard-sanitized-write" | "display-capture" | "fullscreen" | "geolocation" | "idle-detection" | "media" | "mediaKeySystem" | "midi" | "midiSysex" | "notifications" | "openExternal" | "pointerLock" | "keyboardLock" | "speaker-selection" | "storage-access" | "top-level-storage-access" | "window-management" | "unknown" | "fileSystem" | (string & {});
export type SessionPermissionCheckType = "clipboard-read" | "clipboard-sanitized-write" | "geolocation" | "fullscreen" | "hid" | "idle-detection" | "media" | "mediaKeySystem" | "midi" | "midiSysex" | "notifications" | "openExternal" | "pointerLock" | "serial" | "storage-access" | "top-level-storage-access" | "usb" | "deprecated-sync-clipboard-read" | "fileSystem" | (string & {});
/**
 * @deprecated Use `SessionPermissionRequestType` or `SessionPermissionCheckType`
 * depending on which permission handler is being typed.
 */
export type SessionPermissionType = SessionPermissionRequestType | SessionPermissionCheckType;
export interface SessionPermissionRequestDetails {
    requestingUrl?: string;
    isMainFrame?: boolean;
    securityOrigin?: string;
    mediaTypes?: Array<"video" | "audio" | "unknown" | (string & {})>;
    externalURL?: string;
    filePath?: string;
    isDirectory?: boolean;
    fileAccessType?: "writable" | "readable" | (string & {});
    [key: string]: unknown;
}
export interface SessionPermissionCheckDetails {
    embeddingOrigin?: string;
    securityOrigin?: string;
    mediaType?: "video" | "audio" | "unknown" | (string & {});
    requestingUrl?: string;
    isMainFrame?: boolean;
    filePath?: string;
    isDirectory?: boolean;
    fileAccessType?: "writable" | "readable" | (string & {});
    [key: string]: unknown;
}
export type SessionPermissionRequestHandler = (webContents: WebContents, permission: SessionPermissionRequestType, callback: (permissionGranted: boolean) => void, details: SessionPermissionRequestDetails) => void;
export type SessionPermissionCheckHandler = (webContents: WebContents | null, permission: SessionPermissionCheckType, requestingOrigin: string, details: SessionPermissionCheckDetails) => boolean;
type SessionDescriptor = {
    id: string;
    partition?: string;
    path?: string;
    windowId?: string;
    cache?: boolean;
    proxyConfig?: NormalizedProxyConfig | null;
};
type SessionPermissionDecision = {
    handled: boolean;
    granted: boolean;
};
type NormalizedProxyConfig = Required<Pick<ProxyConfig, "mode">> & Omit<ProxyConfig, "mode">;
type NormalizedPreconnectOptions = Required<SessionPreconnectOptions>;
type SessionAppEventMap = {
    "session-created": (session: Session) => void;
};
export declare class Cookies extends EventEmitter {
    private readonly descriptor;
    private observing;
    private pollingTimer;
    private polling;
    private pollAgainAfterCurrent;
    private snapshotGeneration;
    private snapshotInitialized;
    private snapshotMutationVersion;
    private cookieSnapshot;
    private sameSiteOverrides;
    private sameSiteOverrideSignatures;
    private emptyNameCookies;
    constructor(descriptor: SessionDescriptor);
    get(filter?: CookiesGetFilter): Promise<Cookie[]>;
    private getNative;
    set(details: CookiesSetDetails): Promise<void>;
    private storeSameSiteOverride;
    private getCookiesMatchingSetDetails;
    remove(url: string, name: string): Promise<void>;
    flushStore(): Promise<void>;
    on<K extends keyof CookiesEvents>(event: K, listener: CookiesEvents[K]): this;
    addListener<K extends keyof CookiesEvents>(event: K, listener: CookiesEvents[K]): this;
    once<K extends keyof CookiesEvents>(event: K, listener: CookiesEvents[K]): this;
    off<K extends keyof CookiesEvents>(event: K, listener: CookiesEvents[K]): this;
    removeListener<K extends keyof CookiesEvents>(event: K, listener: CookiesEvents[K]): this;
    emit<K extends keyof CookiesEvents>(event: K, ...args: Parameters<CookiesEvents[K]>): boolean;
    removeAllListeners(eventName?: string | symbol): this;
    /** @internal */
    _emitChanged(cookie: Cookie, cause: CookiesChangedCause, removed: boolean): void;
    /** @internal */
    _dispose(): void;
    private startObservingIfNeeded;
    private startObservingIfChangedEvent;
    private startPolling;
    private pollCookieChanges;
    private stopPollingIfUnused;
    private emitPolledChanged;
    private emitCookieChanged;
    private applySameSiteOverride;
    private mergeEmptyNameCookies;
    private setEmptyNameCookie;
    private removeEmptyNameCookies;
    private purgeExpiredEmptyNameCookies;
}
export declare class Session extends EventEmitter {
    private readonly descriptor;
    readonly cookies: Cookies;
    readonly webRequest: WebRequest;
    readonly netLog: NetLog;
    readonly serviceWorkers: ServiceWorkers;
    readonly extensions: Extensions;
    private readonly sessionProtocol;
    private downloadPath;
    private permissionRequestHandler;
    private permissionCheckHandler;
    private userAgent;
    private acceptLanguages;
    private networkEmulation;
    private proxyConfig;
    private cachedPacProxyInfo;
    private preconnectRequests;
    private ntlmCredentialsDomains;
    private sslConfig;
    private activeFetchControllers;
    private certificateVerifyProc;
    private certificateVerifyResultCache;
    private preloadScripts;
    private codeCachePath;
    private lastClearedCodeCacheUrls;
    private spellCheckerEnabledState;
    private spellCheckerLanguages;
    private spellCheckerDictionaryDownloadURL;
    private spellCheckerDictionaryWords;
    private displayMediaRequestHandler;
    private displayMediaRequestHandlerOptions;
    private devicePermissionHandler;
    private usbProtectedClassesHandler;
    private zoomFactorsByOrigin;
    private blobDataHandles;
    private constructor();
    get partition(): string;
    getStoragePath(): string | null;
    get storagePath(): string | null;
    get protocol(): Protocol;
    isPersistent(): boolean;
    clearCache(): Promise<void>;
    getCacheSize(): Promise<number>;
    clearStorageData(options?: SessionClearStorageDataOptions): Promise<void>;
    clearData(options?: SessionClearDataOptions | SessionClearStorageDataOptions): Promise<void>;
    flushStorageData(): Promise<void>;
    setDownloadPath(downloadPath: string | null): void;
    setUserAgent(userAgent: string, acceptLanguages?: string): void;
    getUserAgent(): string;
    resolveHost(host: string, options?: SessionResolveHostOptions): Promise<SessionResolvedHost>;
    fetch(input: string | URL | Request, init?: SessionFetchInit): Promise<Response>;
    setProxy(config: ProxyConfig): Promise<void>;
    private fetchNetworkOrFileResponse;
    resolveProxy(url: string | URL): Promise<string>;
    forceReloadProxyConfig(): Promise<void>;
    setCertificateVerifyProc(proc: CertificateVerifyProc | null): void;
    private runCertificateVerifyProc;
    private verifyTLSSocketCertificate;
    registerPreloadScript(script: PreloadScriptRegistration): string;
    unregisterPreloadScript(id: string): void;
    getPreloadScripts(): PreloadScript[];
    setCodeCachePath(codeCachePath: string): void;
    clearCodeCaches(options?: SessionClearCodeCachesOptions): Promise<void>;
    getSharedDictionaryUsageInfo(): Promise<SharedDictionaryUsageInfo[]>;
    getSharedDictionaryInfo(options: SharedDictionaryIsolationKey): Promise<SharedDictionaryInfo[]>;
    clearSharedDictionaryCache(): Promise<void>;
    clearSharedDictionaryCacheForIsolationKey(options: SharedDictionaryIsolationKey): Promise<void>;
    setSpellCheckerEnabled(enable: boolean): void;
    isSpellCheckerEnabled(): boolean;
    get spellCheckerEnabled(): boolean;
    set spellCheckerEnabled(enable: boolean);
    get availableSpellCheckerLanguages(): string[];
    setSpellCheckerLanguages(languages: string[]): void;
    getSpellCheckerLanguages(): string[];
    setSpellCheckerDictionaryDownloadURL(url: string): void;
    listWordsInSpellCheckerDictionary(): Promise<string[]>;
    addWordToSpellCheckerDictionary(word: string): boolean;
    removeWordFromSpellCheckerDictionary(word: string): boolean;
    setDisplayMediaRequestHandler(handler: DisplayMediaRequestHandler | null, options?: DisplayMediaRequestHandlerOptions): void;
    setDevicePermissionHandler(handler: DevicePermissionHandler | null): void;
    setUSBProtectedClassesHandler(handler: USBProtectedClassesHandler | null): void;
    preconnect(options: SessionPreconnectOptions): void;
    closeAllConnections(): Promise<void>;
    clearHostResolverCache(): Promise<void>;
    allowNTLMCredentialsForDomains(domains: string): void;
    setSSLConfig(config: SessionSSLConfig): void;
    clearAuthCache(): Promise<void>;
    getBlobData(identifier: string): Promise<Buffer>;
    private registerBlobData;
    createInterruptedDownload(options: CreateInterruptedDownloadOptions): void;
    enableNetworkEmulation(options: SessionNetworkEmulationOptions): void;
    disableNetworkEmulation(): void;
    /** @internal */
    _getAcceptLanguages(): string | null;
    /** @internal */
    _getNetworkEmulation(): Required<SessionNetworkEmulationOptions> | null;
    /** @internal */
    _getProxyConfig(): ProxyConfig | null;
    /** @internal */
    _getPreconnectRequests(): NormalizedPreconnectOptions[];
    /** @internal */
    _getNTLMCredentialsDomains(): string;
    /** @internal */
    _getSSLConfig(): SessionSSLConfig | null;
    /** @internal */
    _getCertificateVerifyProc(): CertificateVerifyProc | null;
    /** @internal */
    _getCertificateVerifyResult(cacheKey: string): number | undefined;
    /** @internal */
    _setCertificateVerifyResult(cacheKey: string, result: number): void;
    /** @internal */
    _getCodeCachePath(): string | null;
    /** @internal */
    _getLastClearedCodeCacheUrls(): string[];
    /** @internal */
    _getSpellCheckerDictionaryDownloadURL(): string;
    /** @internal */
    _getDisplayMediaRequestHandler(): DisplayMediaRequestHandler | null;
    /** @internal */
    _getDisplayMediaRequestHandlerOptions(): DisplayMediaRequestHandlerOptions;
    /** @internal */
    _getDevicePermissionHandler(): DevicePermissionHandler | null;
    /** @internal */
    _getUSBProtectedClassesHandler(): USBProtectedClassesHandler | null;
    private normalizeNetworkEmulationNumber;
    private resolvePacProxy;
    downloadURL(url: string, options?: DownloadURLOptions): void;
    setPermissionRequestHandler(handler: SessionPermissionRequestHandler | null): void;
    setPermissionCheckHandler(handler: SessionPermissionCheckHandler | null): void;
    /** @internal */
    _getNativeDescriptor(): SessionDescriptor;
    /** @internal */
    _getPreloadScriptsForType(type: PreloadScriptType): PreloadScript[];
    /** @internal */
    _getZoomOriginKey(url: string | null | undefined): string | null;
    /** @internal */
    _getZoomFactorForURL(url: string | null | undefined): number | null;
    /** @internal */
    _setZoomFactorForURL(url: string | null | undefined, factor: number): string | null;
    /** @internal */
    _handlePermissionRequest(webContents: WebContents | null, permission: SessionPermissionRequestType, details: SessionPermissionRequestDetails): Promise<SessionPermissionDecision>;
    /** @internal */
    _handlePermissionCheck(webContents: WebContents | null, permission: SessionPermissionCheckType, requestingOrigin: string, details: SessionPermissionCheckDetails): SessionPermissionDecision;
    /** @internal */
    _handleDisplayMediaRequest(webContents: WebContents | null, request: DisplayMediaRequest): Promise<DisplayMediaRequestDecision>;
    /** @internal */
    _downloadURL(url: string, options: DownloadURLOptions | undefined, webContents: WebContents | null, metadata?: InternalDownloadMetadata): void;
    private startInvalidDownload;
    private startDownload;
    private startBlockedWebContentsDownload;
    private fetchDownloadResponse;
    private startFileDownload;
    private resumeInterruptedDownload;
    private waitForDownloadSavePathWindow;
    private resolveDownloadSavePath;
    private emitWillDownload;
    /** @internal */
    static _onAppEvent<K extends keyof SessionAppEventMap>(eventName: K, listener: SessionAppEventMap[K]): () => void;
    private _emitAppSessionEvent;
    /** @internal */
    static _fromWebContents(windowId: string, partition?: string, cache?: boolean): Session;
    /** @internal */
    static _registerWebContents(windowId: string, webContents: WebContents): void;
    /** @internal */
    static _forgetWebContents(windowId: string): void;
    /** @internal */
    static _resolvePermissionContext(windowId?: string): {
        session: Session | null;
        webContents: WebContents | null;
    };
    /** @internal */
    static _resolveProtocolForNativeRequest(request: {
        scheme: string;
        windowId?: string;
        partition?: string;
        sessionPath?: string;
    }): Session | null;
    static fromPartition(partition: string, options?: FromPartitionOptions): Session;
    static fromPath(path: string, options?: FromPathOptions): Session;
    on<K extends keyof SessionEvents>(event: K, listener: SessionEvents[K]): this;
    once<K extends keyof SessionEvents>(event: K, listener: SessionEvents[K]): this;
    off<K extends keyof SessionEvents>(event: K, listener: SessionEvents[K]): this;
    emit<K extends keyof SessionEvents>(event: K, ...args: Parameters<SessionEvents[K]>): boolean;
}
export declare const session: {
    readonly defaultSession: Session;
    fromPartition(partition: string, options?: FromPartitionOptions): Session;
    fromPath(path: string, options?: FromPathOptions): Session;
};
export declare const wireSessionHandlers: (ipcServer: GlazeIPCServer) => void;
export {};
