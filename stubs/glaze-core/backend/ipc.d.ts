/**
 * Glaze Framework - IPC Server
 *
 * Handles backend IPC communication between backend and frontend
 */
import { type IPCHandler, type IPCHandlerExecutionOptions, type IPCNotificationOptions, type StreamingIPCHandler } from "./types.js";
type IPCServerStartOptions = {
    markReady?: boolean;
};
export declare class GlazeIPCServer {
    /** Singleton instance — the runtime creates the canonical server. */
    private static _instance;
    private clients;
    private handlers;
    private oneWayHandlers;
    private handlerExecutionOptions;
    private oneWayHandlerExecutionOptions;
    private streamingHandlers;
    private streamingHandlerExecutionOptions;
    private activeStreamingRequests;
    private stdioClient;
    private stdioBuffer;
    private stdioListening;
    private stdioAutoMarkReady;
    private stdioReadyMarked;
    private stdioMarkReadyPromise;
    private stdioStartTime;
    private readonly messageLanes;
    private readonly inFlightMessageTasks;
    private readonly envelopeCapableRenderers;
    private readonly messageTaskWaiters;
    private activeMessageTasks;
    private readonly maxConcurrentMessageTasks;
    constructor();
    private registerBuiltInHandlers;
    handle<TParams, TResult>(method: string, handler: IPCHandler<TParams, TResult>, options?: IPCHandlerExecutionOptions<TParams>): void;
    handleOneWay<TParams, TResult>(method: string, handler: IPCHandler<TParams, TResult>, options?: IPCHandlerExecutionOptions<TParams>): void;
    removeHandler(method: string): boolean;
    removeOneWayHandler(method: string): boolean;
    removeStreamHandler(method: string): boolean;
    handleStream<TParams, TChunk, TResult>(method: string, handler: StreamingIPCHandler<TParams, TChunk, TResult>, options?: IPCHandlerExecutionOptions<TParams>): void;
    start(options?: IPCServerStartOptions): Promise<void>;
    stop(): Promise<void>;
    /**
     * Whether the renderer that sent `message` can decode the structured-clone
     * transport envelope. Older preloads (frozen before the envelope existed) never
     * advertise this, so their responses must be sent as raw values (matching the
     * pre-envelope behavior they were built against).
     */
    private rendererSupportsEnvelope;
    /**
     * Record an envelope-capable renderer (by clientId and windowId) so targeted
     * notifications — which carry no per-request meta — can be encoded correctly.
     */
    private trackRendererCapability;
    /**
     * Whether a notification target is a renderer known to decode the envelope.
     * Untargeted broadcasts reach the whole (possibly mixed-version) fleet, so they
     * are never encoded; unknown targets default to raw for safety.
     */
    private targetSupportsEnvelope;
    /**
     * Broadcast a notification to all connected clients
     * These are push notifications without a request ID
     */
    broadcast(method: string, data: unknown, options?: IPCNotificationOptions): void;
    /**
     * Send a request message to all connected clients
     * This includes an ID for request/response pattern
     */
    sendRequestToAll(request: {
        id: string;
        method: string;
        params?: unknown;
    }): number;
    private startStdio;
    private stopStdio;
    private handleStdioData;
    private deserializeInboundMessage;
    private scheduleInboundMessage;
    private enqueueLaneTask;
    private enqueueMessageTask;
    private isNativeResponseMessage;
    private processNativeResponseMessage;
    private processInboundMessage;
    private respondWithProcessingError;
    private markReadyFromStdio;
    private resolveExecutionLane;
    private isLikelyMutationMethod;
    private deriveMutationScopeKey;
    private unwrapPrimaryParam;
    private extractScopedId;
    private authorizeRequest;
    private isAuthorized;
    private authorizationDenialReason;
    private resolveMaxConcurrentMessageTasks;
    private acquireMessageExecutionSlot;
    private releaseMessageExecutionSlot;
    private handleMessage;
    private handleStreamingMessage;
    private cancelStreamingRequest;
}
export {};
