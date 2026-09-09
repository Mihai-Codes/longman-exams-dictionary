import { Readable, Writable } from "node:stream";
import { Session, type SessionFetchInit, type SessionResolvedEndpoint, type SessionResolvedHost, type SessionResolveHostOptions } from "./session.js";
export type NetFetchInit = SessionFetchInit;
export type NetResolveHostOptions = SessionResolveHostOptions;
export type ResolvedEndpoint = SessionResolvedEndpoint;
export type ResolvedHost = SessionResolvedHost;
export type ClientRequestRedirectPolicy = "follow" | "error" | "manual";
export type ClientRequestCredentials = "include" | "omit" | "same-origin";
export type ClientRequestCache = "default" | "no-store" | "reload" | "no-cache" | "force-cache" | "only-if-cached";
export type ClientRequestPriority = "throttled" | "idle" | "lowest" | "low" | "medium" | "highest";
export interface ClientRequestConstructorOptions {
    method?: string;
    url?: string;
    href?: string;
    headers?: Record<string, string | string[]>;
    session?: Session;
    partition?: string;
    bypassCustomProtocolHandlers?: boolean;
    credentials?: ClientRequestCredentials;
    useSessionCookies?: boolean;
    protocol?: "http:" | "https:" | string;
    host?: string;
    hostname?: string;
    port?: number | string;
    path?: string;
    redirect?: ClientRequestRedirectPolicy;
    origin?: string;
    referrerPolicy?: ReferrerPolicy | "";
    cache?: ClientRequestCache;
    priority?: ClientRequestPriority;
    priorityIncremental?: boolean;
}
export interface UploadProgress {
    active: boolean;
    started: boolean;
    current: number;
    total: number;
}
export interface ClientRequestAuthInfo {
    isProxy: boolean;
    scheme: string;
    host: string;
    port: number;
    realm: string;
}
type HeaderValue = string | string[];
type ClientRequestCallback = (message: IncomingMessage) => void;
type ClientRequestLoginCallback = (username?: string, password?: string) => void;
export declare class IncomingMessage extends Readable {
    readonly statusCode: number;
    readonly statusMessage: string;
    readonly headers: Record<string, string | string[]>;
    readonly rawHeaders: string[];
    readonly httpVersion = "1.1";
    readonly httpVersionMajor = 1;
    readonly httpVersionMinor = 1;
    get rawTrailers(): never;
    get trailers(): never;
    constructor(response: Response);
    _read(): void;
    _pushChunk(chunk: Uint8Array): void;
    _finish(): void;
    _abort(error?: Error): void;
}
export declare class ClientRequest extends Writable {
    private readonly options;
    private readonly bodyChunks;
    private started;
    private firstWrite;
    private aborted;
    private requestClosed;
    private chunkedEncodingValue;
    private abortController;
    private followRedirectCallback;
    private response;
    private uploadProgress;
    private proxyAuthorization;
    constructor(options: ClientRequestConstructorOptions | string, callback?: ClientRequestCallback);
    get chunkedEncoding(): boolean;
    set chunkedEncoding(value: boolean);
    setHeader(name: string, value: string): void;
    getHeader(name: string): HeaderValue | undefined;
    removeHeader(name: string): void;
    followRedirect(): void;
    abort(): void;
    getUploadProgress(): UploadProgress;
    _write(chunk: Buffer | string, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
    on(event: "finish", listener: () => void): this;
    on(event: "drain", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: "close", listener: () => void): this;
    on(event: "pipe", listener: (src: Readable) => void): this;
    on(event: "unpipe", listener: (src: Readable) => void): this;
    on(event: "response", listener: (response: IncomingMessage) => void): this;
    on(event: "login", listener: (authInfo: ClientRequestAuthInfo, callback: ClientRequestLoginCallback) => void): this;
    on(event: "abort", listener: () => void): this;
    on(event: "redirect", listener: (statusCode: number, method: string, redirectUrl: string, responseHeaders: Record<string, string[]>) => void): this;
    on(event: "upload-progress", listener: (position: number, total: number) => void): this;
    once(event: "finish", listener: () => void): this;
    once(event: "drain", listener: () => void): this;
    once(event: "error", listener: (error: Error) => void): this;
    once(event: "close", listener: () => void): this;
    once(event: "pipe", listener: (src: Readable) => void): this;
    once(event: "unpipe", listener: (src: Readable) => void): this;
    once(event: "response", listener: (response: IncomingMessage) => void): this;
    once(event: "login", listener: (authInfo: ClientRequestAuthInfo, callback: ClientRequestLoginCallback) => void): this;
    once(event: "abort", listener: () => void): this;
    once(event: "redirect", listener: (statusCode: number, method: string, redirectUrl: string, responseHeaders: Record<string, string[]>) => void): this;
    once(event: "upload-progress", listener: (position: number, total: number) => void): this;
    private startRequest;
    private issueRequest;
    private headersForRequestURL;
    private requestAuthCredentials;
    private handleRedirect;
    private emitResponse;
    private fail;
    private closeOnce;
}
export declare const net: {
    request(options: ClientRequestConstructorOptions | string, callback?: ClientRequestCallback): ClientRequest;
    fetch(input: string | URL | Request, init?: NetFetchInit): Promise<Response>;
    resolveHost(host: string, options?: NetResolveHostOptions): Promise<ResolvedHost>;
    /**
     * Report whether the default session currently has network access.
     *
     * In Glaze this reflects only the session's network-emulation state: it
     * returns `false` while offline emulation is enabled and `true` otherwise, so
     * it cannot observe a real connection drop. For live connectivity, prefer
     * `navigator.onLine` together with the window `online`/`offline` events in the
     * renderer; to confirm a specific host is reachable, request it with a timeout.
     */
    isOnline(): boolean;
    /**
     * Property form of {@link net.isOnline}. Reflects only emulated session state;
     * for live connectivity use `navigator.onLine` and the `online`/`offline`
     * events in the renderer.
     */
    readonly online: boolean;
};
export {};
