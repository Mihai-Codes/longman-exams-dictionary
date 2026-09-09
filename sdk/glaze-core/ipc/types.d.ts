export interface FrontendConfig {
    webViewClientAuthToken?: string;
    transport?: "stdio";
}
export interface NativeBridge {
    request(method: string, params?: unknown): Promise<unknown>;
}
export interface WebViewMessage {
    id: string;
    method: string;
    params?: unknown;
}
export interface WebViewResponse {
    id: string;
    result?: unknown;
    error?: string;
}
export interface IpcTransport {
    connect(url: string): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    sendMessage(method: string, params?: unknown, timeoutMs?: number, options?: {
        kind?: "send" | "invoke" | "stream";
    }): Promise<unknown>;
    sendStreamingMessage(method: string, params: unknown, onChunk: (chunk: unknown) => void, options?: {
        signal?: AbortSignal;
    }): Promise<unknown>;
    onNotification<TParams = unknown>(method: string, handler: (params: TParams) => void): () => void;
}
