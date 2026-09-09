export interface Request {
    jsonrpc: "2.0";
    id: string;
    method: string;
    params?: unknown;
    meta?: {
        ipcKind?: "send" | "invoke" | "stream";
        transport?: {
            structuredCloneV1?: boolean;
        };
    };
}
export interface Response {
    jsonrpc: "2.0";
    id: string;
    result?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}
export interface StreamResponse {
    jsonrpc: "2.0";
    id: string | number;
    type: "chunk" | "complete" | "error";
    data?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}
/**
 * Marks errors that mean a request never received a clean reply from the host — the
 * request timed out, or the transport was torn down before a reply arrived. This is
 * distinct from a host that *did* reply with a JSON-RPC error: a transport failure
 * leaves the host's actual behaviour unknown, whereas an explicit error reply is a
 * definitive answer. The native-bridge transport relies on this distinction so a
 * lost/timed-out capability probe is not mistaken for a confirmed "old host". See
 * native-bridge-transport.ts.
 */
export interface IpcTransportFailure {
    readonly isIpcTransportFailure: true;
}
export declare function isIpcTransportFailure(error: unknown): error is Error & IpcTransportFailure;
export type IpcRequestOperation = "send" | "invoke" | "stream";
export type IpcRequestTimeoutDiagnostics = {
    method?: string;
    operation?: IpcRequestOperation;
    timeoutMs?: number;
    ageMs?: number;
    idleMs?: number;
};
/** Raised when a pending request's reply does not arrive before its timeout elapses. */
export declare class IpcRequestTimeoutError extends Error implements IpcTransportFailure {
    readonly isIpcTransportFailure: true;
    readonly ipcOperation?: IpcRequestOperation;
    readonly ipcChannel?: string;
    readonly ipcRawMessage: string;
    readonly ipcSanitizedMessage = "Something went wrong. Please try again.";
    readonly ipcFailureKind = "request_timeout";
    readonly ipcTimeoutMs?: number;
    readonly ipcAgeMs?: number;
    readonly ipcIdleMs?: number;
    constructor(id: string, diagnostics?: IpcRequestTimeoutDiagnostics);
}
export declare class MessageProcessor {
    private pendingRequests;
    private requestCounter;
    private notificationHandlers;
    private notificationQueue;
    private readonly MAX_QUEUE_SIZE;
    private lastClearPendingReason;
    private lastClearPendingAt;
    generateRequestId(): string;
    createRequest(method: string, params?: unknown, meta?: Request["meta"]): Request;
    registerPendingRequest(id: string, resolve: (value: unknown) => void, reject: (error: Error) => void, timeoutMs?: number, method?: string, operation?: IpcRequestOperation): void;
    registerStreamingRequest(id: string, onChunk: (chunk: unknown) => void, resolve: (value: unknown) => void, reject: (error: Error) => void, timeoutMs?: number, // 1 hour of stream *inactivity*, not total duration
    method?: string): void;
    /**
     * Streaming requests time out on *inactivity*, not wall-clock age: every chunk
     * refreshes `lastActivityAt`, and when the timer fires it re-arms for the
     * remainder of the configured idle window (`metadata.timeoutMs`) instead of
     * rejecting if traffic arrived in the meantime. Long agent runs (which can
     * legitimately stream for hours) stay alive as long as the backend keeps
     * talking, while a genuinely dead stream is still rejected after a full idle
     * window of silence. Checking lazily on fire — rather than resetting the
     * timer on every chunk — keeps high-frequency streams from churning timers.
     *
     * `delayMs` is only this timer's delay; idleness is always judged against
     * the configured window so repeated re-arms never shrink it.
     */
    private scheduleStreamInactivityTimeout;
    handleResponse(message: string): void;
    handleResponseObject(response: Record<string, unknown>): void;
    private handleStreamResponse;
    private hydrateBackendError;
    private normalizeResponseId;
    clearAllPending(error: Error, reason?: string): void;
    registerNotificationHandler(method: string, handler: (params: unknown) => void): () => void;
    private handleNotification;
}
