import { type IpcTransport } from "./types";
export declare class NativeBridgeTransport implements IpcTransport {
    private messageProcessor;
    private connected;
    private connectPromise;
    private readonly clientId;
    private readonly webViewId;
    private listenerAttached;
    private hostEnvelopeSupport;
    private hostCapabilityProbe;
    private activeStreamCleanup;
    private connectionEpoch;
    constructor();
    connect(_url: string): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    sendMessage(method: string, params?: unknown, timeoutMs?: number, options?: {
        kind?: "send" | "invoke" | "stream";
    }): Promise<unknown>;
    sendStreamingMessage(method: string, params: unknown, onChunk: (chunk: unknown) => void, options?: {
        signal?: AbortSignal;
    }): Promise<unknown>;
    private postStreamCancellation;
    onNotification<TParams = unknown>(method: string, handler: (params: TParams) => void): () => void;
    /**
     * Decide the wire form of outbound params: raw JSON when possible, the
     * structured-clone envelope only when the value needs it *and* the host can
     * decode it.
     */
    private encodeOutboundParams;
    private ensureHostCapabilityProbe;
    private probeHostCapabilities;
    private createHostEnvelopeUnsupportedError;
    private createHostCapabilityUnknownError;
    private postRequest;
    private postMessage;
    private handleMessage;
    private attachListener;
    private detachListener;
    private attachDirectReceiver;
    private handleIncomingMessage;
    private createClientId;
    private getWebViewId;
}
