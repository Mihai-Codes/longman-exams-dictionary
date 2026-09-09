/**
 * Glaze Framework - ipcRenderer API
 *
 * Provides an API surface for renderer process IPC
 * while using the existing transport infrastructure under the hood.
 */
import { type IpcTransport } from "./types.js";
import { ElectronEventEmitter, type ElectronEventName, type ElectronEventListener } from "./electron-event-emitter.js";
type IpcRendererStreamOptions = {
    /** Used by callers in the same JavaScript world. */
    signal?: AbortSignal;
    /** Clone-safe cancellation handle for preload-exposed callers. */
    cancellationId?: string;
};
/**
 * Event object passed to ipcRenderer listeners
 */
export interface IpcRendererEvent {
    /**
     * The IpcRenderer instance that emitted the event
     */
    sender: IpcRenderer;
    /**
     * Message ports transferred with this event.
     */
    ports: MessagePort[];
    /**
     * The senderID of the webContents that sent the message
     */
    senderId?: number;
    /**
     * Information about the sender frame
     */
    senderFrame?: {
        frameId: number;
        processId: number;
        routingId: number;
    };
    /**
     * The channel the message was sent on
     */
    channel?: string;
}
/**
 * Listener function type for ipcRenderer
 */
export type IpcRendererListener<T extends any[] = any[]> = (event: IpcRendererEvent, ...args: T) => void;
/**
 * Renderer process IPC handler
 */
declare class IpcRenderer extends ElectronEventEmitter {
    private transport;
    private listenerChannels;
    private listenerUnsubscribers;
    private isInitialized;
    private initPromise;
    private contextReleased;
    private dispatchQueue;
    private messagePortControlUnsubscribe;
    private transferredRendererPorts;
    private rendererTransferredMessagePorts;
    private nextRendererTransferredPortId;
    private streamCancellationControllers;
    constructor();
    /**
     * Send a message to the main process asynchronously via channel,
     * along with arguments. Arguments will be serialized with the
     * Structured Clone Algorithm, just like window.postMessage,
     * so prototype chains will not be included.
     */
    send(channel: string, ...args: any[]): void;
    private enqueueTransportDispatch;
    /**
     * Send a message to the main process, optionally transferring ownership of
     * MessagePorts.
     */
    postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
    /**
     * Send a message to the main process asynchronously via channel,
     * along with arguments. Returns a Promise that resolves with the response.
     *
     * The main process should listen for channel with ipcMain.handle()
     *
     * Note: This waits indefinitely for a response (no timeout).
     */
    invoke(channel: string, ...args: any[]): Promise<any>;
    /**
     * Send a message to the main process via channel and expect a result
     * synchronously. Arguments will be serialized with the Structured Clone
     * Algorithm, just like window.postMessage, so prototype chains will not
     * be included.
     *
     * NOTE: Synchronous IPC is not recommended in web contexts.
     * This method is provided for compatibility but
     * internally uses async with blocking wait.
     *
     * @deprecated Use invoke() instead for better performance
     */
    sendSync(_channel: string, ..._args: any[]): any;
    /**
     * Listens to channel, when a new message arrives listener would
     * be called with listener(event, args...)
     */
    on(channel: string, listener: IpcRendererListener): this;
    on(channel: ElectronEventName, listener: ElectronEventListener): this;
    /**
     * Adds a one-time listener function for the event. This listener
     * is invoked only the next time a message is sent to channel,
     * after which it is removed.
     */
    once(channel: string, listener: IpcRendererListener): this;
    once(channel: ElectronEventName, listener: ElectronEventListener): this;
    /**
     * Alias for on
     */
    addListener(channel: string, listener: IpcRendererListener): this;
    addListener(channel: ElectronEventName, listener: ElectronEventListener): this;
    prependListener(channel: string, listener: IpcRendererListener): this;
    prependListener(channel: ElectronEventName, listener: ElectronEventListener): this;
    prependOnceListener(channel: string, listener: IpcRendererListener): this;
    prependOnceListener(channel: ElectronEventName, listener: ElectronEventListener): this;
    /**
     * Alias for removeListener
     */
    off(channel: string, listener: IpcRendererListener): this;
    off(channel: ElectronEventName, listener: ElectronEventListener): this;
    /**
     * Removes the specified listener from the listener array for the
     * specified channel
     */
    removeListener(channel: string, listener: IpcRendererListener): this;
    removeListener(channel: ElectronEventName, listener: ElectronEventListener): this;
    /**
     * Removes all listeners, or those of the specified channel
     */
    removeAllListeners(channel?: ElectronEventName): this;
    /**
     * Send a message to the main process and expect a stream of responses.
     * This is a Glaze-specific extension.
     *
     * @param channel - The channel to send on
     * @param args - Arguments to send
     * @param onChunk - Callback for each chunk received
     * @param options - Optional cancellation signal
     * @returns Promise that resolves with the final result
     */
    stream<TChunk = any, TResult = any>(channel: string, args: any, onChunk: (chunk: TChunk) => void, options?: IpcRendererStreamOptions): Promise<TResult>;
    /** Cancel a stream through a clone-safe identifier exposed by the preload bridge. */
    cancelStream(cancellationId: string): void;
    /**
     * Internal: Wire this ipcRenderer to a transport implementation
     * Called during initialization
     */
    _wireToClient(client?: IpcTransport): Promise<void>;
    /**
     * Internal: Connect to the backend with retry logic
     * Retries with exponential backoff if the backend isn't ready yet
     */
    private connect;
    /**
     * Ensure the client is connected
     */
    private ensureConnected;
    /**
     * Setup message handling for push messages from backend
     */
    private setupMessageHandling;
    private registerAllNotificationListeners;
    private registerNotificationListener;
    private unregisterNotificationListener;
    private unregisterAllNotificationListeners;
    private dispatchNotification;
    private unpackNotificationPayload;
    private createTransferredRendererPort;
    private validatePostMessageTransferList;
    private createRendererTransferredMessagePortDescriptor;
    private registerMessagePortControlListener;
    private unregisterMessagePortControlListener;
    private dispatchMessagePortControl;
    private normalizeMessagePortControlMessage;
    private createRendererTransferredMessagePortsControlPayload;
    private closeTransferredRendererPorts;
    private registerIPCListenerChannel;
    private unregisterIPCListenerChannelIfEmpty;
    private assertChannel;
    private assertCancellationId;
    private assertContextActive;
    private setupContextReleaseHandling;
    private markContextReleased;
    /**
     * Check if we're running in a Glaze app
     */
    private isGlazeApp;
    /**
     * Check if the renderer is connected to the backend
     */
    isConnected(): boolean;
    /**
     * Wait for the IPC connection to be ready.
     * Use this if you need to ensure the connection is established before
     * making IPC calls. This is automatically called by invoke() and other
     * IPC methods, so you only need this for explicit waiting scenarios.
     *
     * @returns Promise that resolves when connected, or rejects after all retries fail
     */
    waitForReady(): Promise<void>;
    /**
     * Disconnect from the backend
     */
    disconnect(): void;
    /**
     * Register a notification handler for backend push notifications
     * This is a Glaze extension for handling notifications from the backend
     *
     * @param method - The notification method name (e.g., "glaze.auth.userChanged")
     * @param handler - Callback function that receives the notification params
     * @returns Unsubscribe function to remove the handler
     */
    onNotification<TParams = unknown>(method: string, handler: (params: TParams) => void): () => void;
    /** @internal */
    _markContextReleasedForTesting(): void;
    /** @internal */
    _resetContextReleasedForTesting(): void;
    private createUserSafeIpcError;
    private stripLegacyIpcErrorPrefix;
    private classifyIpcFailure;
    private sanitizeErrorMessage;
    private createElectronInvokeErrorMessage;
}
/**
 * Singleton instance of IpcRenderer
 */
export declare const ipcRenderer: IpcRenderer;
export {};
