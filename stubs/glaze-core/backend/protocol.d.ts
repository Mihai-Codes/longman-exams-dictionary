import { type GlazeIPCServer } from "./ipc.js";
export type ProtocolPrivileges = {
    standard?: boolean;
    secure?: boolean;
    supportFetchAPI?: boolean;
    stream?: boolean;
    corsEnabled?: boolean;
    allowServiceWorkers?: boolean;
    bypassCSP?: boolean;
};
export type PrivilegedScheme = {
    scheme: string;
    privileges?: ProtocolPrivileges;
};
export type ProtocolRequest = Request & {
    readonly scheme: string;
    readonly headers: Headers & Record<string, string | undefined>;
};
type ProtocolIncomingRequest = {
    requestId?: string;
    scheme: string;
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    bodyEncoding?: "base64" | "utf8";
    windowId?: string;
    partition?: string;
    sessionPath?: string;
    cache?: boolean;
};
export type ProtocolResponse = {
    statusCode?: number;
    statusText?: string;
    headers?: Record<string, string>;
    body?: string;
    bodyEncoding?: "base64" | "utf8";
    filePath?: string;
    filePathRoot?: string;
};
export type ProtocolFileResponseOptions = {
    root: string;
    headers?: Record<string, string>;
    statusCode?: number;
    statusText?: string;
};
type ProtocolHandlerResult = Response | ProtocolResponse | {
    path: string;
    headers?: Record<string, string>;
    statusCode?: number;
    statusText?: string;
} | {
    data: string | Uint8Array | ArrayBuffer;
    headers?: Record<string, string>;
    statusCode?: number;
    statusText?: string;
};
type ProtocolHandler = (request: ProtocolRequest) => Promise<ProtocolHandlerResult> | ProtocolHandlerResult;
export interface Protocol {
    registerSchemesAsPrivileged(schemes: PrivilegedScheme[]): void;
    /** @deprecated Use protocol.registerSchemesAsPrivileged(). */
    registerSchemesAsPrivilegedAsync(schemes: PrivilegedScheme[]): Promise<void>;
    createFileResponse(filePath: string, options: ProtocolFileResponseOptions): ProtocolResponse;
    handle(scheme: string, handler: ProtocolHandler): void;
    unhandle(scheme: string): void;
    /** @deprecated Use protocol.unhandle(). */
    unhandleAsync(scheme: string): Promise<void>;
    /** @deprecated Use protocol.unhandle(). */
    unregisterProtocol(scheme: string): Promise<void>;
    isProtocolHandled(scheme: string): boolean;
}
export declare const setProtocolSessionResolver: (resolver: ((request: ProtocolIncomingRequest) => Protocol | null) | null) => void;
export declare const protocol: Protocol;
export declare const createSessionProtocol: () => Protocol;
export declare const handleProtocolFetchRequest: (request: Request, protocolObject?: Protocol) => Promise<Response | null>;
export declare const wireProtocolHandlers: (ipcServer: GlazeIPCServer) => void;
export {};
