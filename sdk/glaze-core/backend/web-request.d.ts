import { type WebContents } from "./web-contents.js";
import { type WebFrameMain } from "./web-frame-main.js";
export type WebRequestResourceType = "mainFrame" | "subFrame" | "stylesheet" | "script" | "image" | "font" | "object" | "xhr" | "ping" | "cspReport" | "media" | "webSocket" | "other";
export type WebRequestFilterType = Exclude<WebRequestResourceType, "other">;
export interface WebRequestFilter {
    urls: string[];
    excludeUrls?: string[];
    types?: WebRequestFilterType[];
}
export interface UploadData {
    bytes: Buffer;
    file?: string;
    blobUUID?: string;
}
export interface WebRequestDetails {
    id: number;
    url: string;
    method: string;
    webContentsId?: number;
    webContents?: WebContents;
    frame?: WebFrameMain | null;
    resourceType: WebRequestResourceType;
    referrer: string;
    timestamp: number;
}
export interface OnBeforeRequestListenerDetails extends WebRequestDetails {
    uploadData?: UploadData[];
}
export interface CallbackResponse {
    cancel?: boolean;
    redirectURL?: string;
}
export type OnBeforeRequestListener = (details: OnBeforeRequestListenerDetails, callback: (response: CallbackResponse) => void) => void;
export interface OnBeforeSendHeadersListenerDetails extends WebRequestDetails {
    uploadData?: UploadData[];
    requestHeaders: Record<string, string>;
}
export interface BeforeSendResponse {
    cancel?: boolean;
    requestHeaders?: Record<string, string | string[]>;
}
export type OnBeforeSendHeadersListener = (details: OnBeforeSendHeadersListenerDetails, callback: (response: BeforeSendResponse) => void) => void;
export interface OnSendHeadersListenerDetails extends WebRequestDetails {
    requestHeaders: Record<string, string>;
}
export type OnSendHeadersListener = (details: OnSendHeadersListenerDetails) => void;
export interface OnHeadersReceivedListenerDetails extends WebRequestDetails {
    statusLine: string;
    statusCode: number;
    responseHeaders?: Record<string, string[]>;
}
export interface HeadersReceivedResponse {
    cancel?: boolean;
    responseHeaders?: Record<string, string | string[]>;
    statusLine?: string;
}
export type OnHeadersReceivedListener = (details: OnHeadersReceivedListenerDetails, callback: (response: HeadersReceivedResponse) => void) => void;
export interface OnResponseStartedListenerDetails extends WebRequestDetails {
    responseHeaders?: Record<string, string[]>;
    fromCache: boolean;
    statusCode: number;
    statusLine: string;
}
export type OnResponseStartedListener = (details: OnResponseStartedListenerDetails) => void;
export interface OnBeforeRedirectListenerDetails extends WebRequestDetails {
    redirectURL: string;
    statusCode: number;
    statusLine: string;
    ip?: string;
    fromCache: boolean;
    responseHeaders?: Record<string, string[]>;
}
export type OnBeforeRedirectListener = (details: OnBeforeRedirectListenerDetails) => void;
export interface OnCompletedListenerDetails extends WebRequestDetails {
    responseHeaders?: Record<string, string[]>;
    fromCache: boolean;
    statusCode: number;
    statusLine: string;
    error?: string;
}
export type OnCompletedListener = (details: OnCompletedListenerDetails) => void;
export interface OnErrorOccurredListenerDetails extends WebRequestDetails {
    fromCache: boolean;
    error: string;
}
export type OnErrorOccurredListener = (details: OnErrorOccurredListenerDetails) => void;
export type WebRequestEventName = "onBeforeRequest" | "onBeforeSendHeaders" | "onSendHeaders" | "onHeadersReceived" | "onResponseStarted" | "onBeforeRedirect" | "onCompleted" | "onErrorOccurred";
type WebRequestListenerMap = {
    onBeforeRequest: OnBeforeRequestListener;
    onBeforeSendHeaders: OnBeforeSendHeadersListener;
    onSendHeaders: OnSendHeadersListener;
    onHeadersReceived: OnHeadersReceivedListener;
    onResponseStarted: OnResponseStartedListener;
    onBeforeRedirect: OnBeforeRedirectListener;
    onCompleted: OnCompletedListener;
    onErrorOccurred: OnErrorOccurredListener;
};
type WebRequestListener<K extends WebRequestEventName> = WebRequestListenerMap[K];
type WebRequestListenerRegistration<K extends WebRequestEventName> = {
    filter: WebRequestFilter | null;
    listener: WebRequestListener<K>;
};
export interface WebRequestFetchDetails {
    url: string;
    method: string;
    requestHeaders: Record<string, string>;
    uploadData?: UploadData[];
    resourceType?: WebRequestResourceType;
    referrer?: string;
}
export interface WebRequestResponseDetails {
    url: string;
    method: string;
    statusCode: number;
    statusLine: string;
    responseHeaders?: Record<string, string[]>;
    resourceType?: WebRequestResourceType;
    referrer?: string;
}
export interface WebRequestRedirectDetails extends WebRequestResponseDetails {
    redirectURL: string;
}
export interface WebRequestBeforeRequestResult {
    cancel?: boolean;
    redirectURL?: string;
}
export interface WebRequestBeforeSendHeadersResult {
    cancel?: boolean;
    requestHeaders: Record<string, string>;
}
export interface WebRequestHeadersReceivedResult {
    cancel?: boolean;
    responseHeaders?: Record<string, string[]>;
    statusLine?: string;
}
export declare class WebRequest {
    private listeners;
    private nextRequestId;
    onBeforeRequest(listener: OnBeforeRequestListener | null): void;
    onBeforeRequest(filter: WebRequestFilter, listener: OnBeforeRequestListener | null): void;
    onBeforeSendHeaders(listener: OnBeforeSendHeadersListener | null): void;
    onBeforeSendHeaders(filter: WebRequestFilter, listener: OnBeforeSendHeadersListener | null): void;
    onSendHeaders(listener: OnSendHeadersListener | null): void;
    onSendHeaders(filter: WebRequestFilter, listener: OnSendHeadersListener | null): void;
    onHeadersReceived(listener: OnHeadersReceivedListener | null): void;
    onHeadersReceived(filter: WebRequestFilter, listener: OnHeadersReceivedListener | null): void;
    onResponseStarted(listener: OnResponseStartedListener | null): void;
    onResponseStarted(filter: WebRequestFilter, listener: OnResponseStartedListener | null): void;
    onBeforeRedirect(listener: OnBeforeRedirectListener | null): void;
    onBeforeRedirect(filter: WebRequestFilter, listener: OnBeforeRedirectListener | null): void;
    onCompleted(listener: OnCompletedListener | null): void;
    onCompleted(filter: WebRequestFilter, listener: OnCompletedListener | null): void;
    onErrorOccurred(listener: OnErrorOccurredListener | null): void;
    onErrorOccurred(filter: WebRequestFilter, listener: OnErrorOccurredListener | null): void;
    /** @internal */
    _getListener<K extends WebRequestEventName>(eventName: K): WebRequestListenerRegistration<K> | null;
    /** @internal */
    _createRequestId(): number;
    /** @internal */
    _dispatchBeforeRequest(id: number, details: WebRequestFetchDetails): Promise<WebRequestBeforeRequestResult>;
    /** @internal */
    _dispatchBeforeSendHeaders(id: number, details: WebRequestFetchDetails): Promise<WebRequestBeforeSendHeadersResult>;
    /** @internal */
    _dispatchSendHeaders(id: number, details: WebRequestFetchDetails): void;
    /** @internal */
    _dispatchHeadersReceived(id: number, details: WebRequestResponseDetails): Promise<WebRequestHeadersReceivedResult>;
    /** @internal */
    _dispatchResponseStarted(id: number, details: WebRequestResponseDetails): void;
    /** @internal */
    _dispatchBeforeRedirect(id: number, details: WebRequestRedirectDetails): void;
    /** @internal */
    _dispatchCompleted(id: number, details: WebRequestResponseDetails): void;
    /** @internal */
    _dispatchErrorOccurred(id: number, details: Pick<WebRequestFetchDetails, "url" | "method" | "resourceType" | "referrer">, error: string): void;
    private setListener;
    private createBaseDetails;
}
export {};
