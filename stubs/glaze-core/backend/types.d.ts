/**
 * Glaze Framework - Type Definitions
 *
 * Shared types for Glaze applications
 */
export interface IPCRequestSender {
    clientId?: string;
    windowId?: string;
    isMainFrame?: boolean;
    frameProcessId?: number;
    frameRoutingId?: number;
    frameURL?: string;
}
/**
 * Capabilities a renderer advertises about its (per-app, build-time-frozen) preload.
 * Used for backward compatibility: a preload built before the structured-clone
 * transport envelope existed cannot decode it, so the backend must fall back to
 * sending raw values to those renderers.
 */
export interface IPCTransportCapabilities {
    /** Renderer can decode the `__glazeIPCStructuredCloneV1` envelope on responses/notifications. */
    structuredCloneV1?: boolean;
}
export interface IPCMessageMeta {
    sender?: IPCRequestSender;
    ipcKind?: "send" | "invoke" | "stream";
    transport?: IPCTransportCapabilities;
}
export interface IPCNotificationTarget {
    clientId?: string;
    windowId?: string;
}
export interface IPCNotificationOptions {
    target?: IPCNotificationTarget;
}
export interface IPCRequestContext {
    id?: string;
    sender?: IPCRequestSender;
}
export interface IPCStreamRequestContext extends IPCRequestContext {
    signal: AbortSignal;
}
export type IPCHandlerKind = "invoke" | "send" | "stream";
export interface IPCAuthorizationContext extends IPCRequestContext {
    channel: string;
    kind: IPCHandlerKind;
}
export type IPCAuthorizationDecision = boolean | {
    allowed: boolean;
    reason?: string;
};
export type IPCHandlerAuthorization<TParams = any> = (params: TParams, context: IPCAuthorizationContext) => IPCAuthorizationDecision | Promise<IPCAuthorizationDecision>;
export type IPCHandler<TParams = any, TResult = any> = (params: TParams, context?: IPCRequestContext) => Promise<TResult>;
export interface IPCHandlerExecutionOptions<TParams = any> {
    /**
     * Optional ordering key resolver.
     * Requests with the same key are executed FIFO relative to each other.
     * Requests with different keys can run in parallel.
     */
    sequenceBy?: (params: TParams) => string | number | null | undefined;
    /**
     * If true, treat the handler as mutating state and apply default scoped FIFO
     * sequencing when no explicit sequenceBy key is provided.
     */
    isMutation?: boolean;
    /**
     * Optional runtime authorization gate.
     * Preload exposure is not a security boundary; sensitive handlers should
     * authorize the native-stamped sender immediately before execution.
     */
    authorize?: IPCHandlerAuthorization<TParams>;
}
export type StreamingIPCHandler<TParams = any, TChunk = any, TResult = any> = (params: TParams, sendChunk: (chunk: TChunk) => void, context: IPCStreamRequestContext) => Promise<TResult>;
export interface IPCMessage {
    id: string;
    method: string;
    params?: any;
    meta?: IPCMessageMeta;
}
export interface IPCResponse {
    jsonrpc: "2.0";
    id: string;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface IPCStreamMessage<T = any> {
    jsonrpc: "2.0";
    id: string;
    type: "chunk" | "complete" | "error";
    data?: T;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface BackendAPI {
    app: {
        ping(): Promise<{
            message: string;
            timestamp: number;
            status: string;
        }>;
    };
}
export type GlazeIPCTransport = "stdio";
