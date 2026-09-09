/**
 * Glaze Framework - ipcMain API
 *
 * Provides an API surface for backend IPC handlers
 * while using the existing GlazeIPCServer infrastructure under the hood.
 */
import { EventEmitter } from "node:events";
import { GlazeIPCServer } from "./ipc.js";
import { type MessagePortMain } from "./message-channel-main.js";
import { type WebFrameMain } from "./web-frame-main.js";
import { type WebContents } from "./web-contents.js";
import { type IPCAuthorizationContext, type IPCAuthorizationDecision, type StreamingIPCHandler } from "./types.js";
export type IpcMainEventSender = WebContents & {
    /**
     * Internal renderer client identifier.
     */
    clientId?: string;
    /**
     * Originating BrowserWindow/native window identifier when available.
     * Prefer this or BrowserWindow.fromWebContents(event.sender) when you need to
     * resolve the calling window.
     */
    windowId?: string;
};
/**
 * Event object passed to ipcMain handlers
 */
export interface IpcMainInvokeEvent {
    /**
     * Message source type.
     */
    type: "frame";
    /**
     * The numeric renderer process identifier that sent the message.
     */
    processId?: number;
    /**
     * The internal ID of the renderer frame that sent the message
     */
    frameId?: number;
    /**
     * The renderer that sent the original message.
     */
    sender: IpcMainEventSender;
    /**
     * The frame that sent the original message.
     */
    senderFrame: WebFrameMain | null;
    /**
     * Native sender metadata for cases where the sender frame cannot be resolved
     * to a JS-owned BrowserWindow/WebContents instance.
     */
    senderFrameURL?: string;
    /**
     * Native sender metadata for cases where the sender frame cannot be resolved
     * to a JS-owned BrowserWindow/WebContents instance.
     */
    senderIsMainFrame?: boolean;
    /**
     * The value sent back by the handler to the renderer process
     */
    returnValue?: any;
}
/**
 * Event object for one-way ipcMain.on() handlers
 */
export interface IpcMainEvent extends IpcMainInvokeEvent {
    /**
     * Message ports transferred with this event.
     */
    ports: MessagePortMain[];
    /**
     * Set this value to reply synchronously to the message
     */
    reply: (channel: string, ...args: any[]) => void;
}
/**
 * Handler function type for ipcMain.handle()
 */
export type IpcMainHandler<T extends any[] = any[], R = any> = (event: IpcMainInvokeEvent, ...args: T) => Promise<R> | R;
/**
 * Handler function type for ipcMain.handleStream()
 */
export type { IPCStreamRequestContext, StreamingIPCHandler } from "./types.js";
export interface IpcMainHandlerOptions<T extends any[] = any[]> {
    /**
     * Optional scoped sequencing key resolver.
     * Handlers with the same key run FIFO; different keys can run in parallel.
     */
    sequenceBy?: (...args: T) => string | number | null | undefined;
    /**
     * Marks this channel as mutating state to enable default scoped FIFO sequencing.
     */
    isMutation?: boolean;
    /**
     * Runtime authorization gate for this invoke handler.
     */
    authorize?: (event: IpcMainInvokeEvent, ...args: T) => IPCAuthorizationDecision | Promise<IPCAuthorizationDecision>;
}
export interface IpcMainStreamHandlerOptions<TParams = any> {
    /**
     * Runtime authorization gate for this streaming handler.
     */
    authorize?: (params: TParams, context: IPCAuthorizationContext) => IPCAuthorizationDecision | Promise<IPCAuthorizationDecision>;
}
/**
 * Listener function type for ipcMain.on()
 */
export type IpcMainListener<T extends any[] = any[]> = (event: IpcMainEvent, ...args: T) => void;
/**
 * Main process IPC handler
 */
type ScopedIpcOwnerKind = "frame" | "contents";
export declare class IpcMain extends EventEmitter {
    private readonly internalErrorListener;
    private handlers;
    private handlerOptions;
    private streamingHandlers;
    private streamingHandlerOptions;
    private listenerChannels;
    private registeredListenerChannels;
    private registeredHandlerChannels;
    private scopedIpcs;
    private internalDefaultChannels;
    private server;
    private connectedClients;
    constructor();
    /**
     * Listens to channel, when a new message arrives listener would be called with
     * listener(event, args...)
     */
    on(channel: string, listener: IpcMainListener): this;
    /**
     * Adds a one-time listener function for the event.
     * This listener is invoked only the next time a message is sent to channel,
     * after which it is removed.
     */
    once(channel: string, listener: IpcMainListener): this;
    /**
     * Alias for on.
     */
    addListener(channel: string, listener: IpcMainListener): this;
    prependListener(channel: string, listener: IpcMainListener): this;
    prependOnceListener(channel: string, listener: IpcMainListener): this;
    /**
     * Alias for removeListener.
     */
    off(channel: string, listener: IpcMainListener): this;
    /**
     * Removes the specified listener from the listener array for the specified channel
     */
    removeListener(channel: string, listener: IpcMainListener): this;
    /**
     * Removes all listeners, or those of the specified channel
     */
    removeAllListeners(channel?: string | symbol): this;
    /**
     * Adds a handler for an invokeable IPC. This handler will be called whenever
     * a renderer calls ipcRenderer.invoke(channel, ...args).
     *
     * If listener returns a Promise, the eventual result of the promise will be
     * returned as a reply to the remote caller. Otherwise, the return value of
     * the listener will be used as the value of the reply.
     */
    handle(channel: string, handler: IpcMainHandler, options?: IpcMainHandlerOptions): void;
    /**
     * Registers a built-in default handler for a channel the runtime owns (e.g.
     * "app:quit"). Unlike `handle()`, an app may later call `handle()` on the same
     * channel to override this default without tripping the duplicate-handler guard.
     * Still throws if an app already owns the channel (the default must not clobber it).
     * @internal
     */
    handleInternalDefault(channel: string, handler: IpcMainHandler, options?: IpcMainHandlerOptions): void;
    /**
     * Handles a single invokeable IPC message, then removes the handler.
     * See ipcMain.handle(channel, handler).
     */
    handleOnce(channel: string, handler: IpcMainHandler, options?: IpcMainHandlerOptions): void;
    /**
     * Adds a streaming handler for an invokeable IPC channel.
     * The handler receives params and a sendChunk callback for streaming
     * intermediate results back to the caller.
     */
    handleStream<TParams = any, TChunk = any, TResult = any>(channel: string, handler: StreamingIPCHandler<TParams, TChunk, TResult>, options?: IpcMainStreamHandlerOptions<TParams>): void;
    /**
     * Removes any handler for channel, if present
     */
    removeHandler(channel: string): void;
    /**
     * Send a message to a specific renderer
     * @param webContentsId - The ID of the renderer to send to
     * @param channel - The channel to send on
     * @param args - Arguments to send
     */
    sendTo(webContentsId: string | number, channel: string, ...args: any[]): void;
    private sendToTarget;
    /**
     * Broadcast a Glaze notification to all connected renderers.
     *
     * This extension intentionally preserves the single-params shape used by
     * `ipcRenderer.onNotification()`. Use `webContents.send()`, `sendTo()`, or
     * `event.reply()` when you need renderer listener rest-argument delivery.
     *
     * @param channel - The channel to broadcast on
     * @param args - Arguments to broadcast
     */
    broadcast(channel: string, ...args: any[]): void;
    /**
     * Internal: Wire this ipcMain instance to a GlazeIPCServer
     * Called during backend initialization
     */
    _wireToServer(server: GlazeIPCServer): void;
    /**
     * Internal: Register a handler with the GlazeIPCServer
     */
    private registerHandlerWithServer;
    private createStreamExecutionOptions;
    /**
     * Internal: Register a listener with the GlazeIPCServer
     */
    private registerListenerWithServer;
    private unregisterListenerWithServer;
    private registerIPCListenerChannel;
    private removeIPCListenerChannelIfEmpty;
    /** @internal */
    _registerScopedIpc(scope: ScopedIpcMain): void;
    /** @internal */
    _unregisterScopedIpc(scope: ScopedIpcMain): void;
    /** @internal */
    _scopeDidAddListener(_scope: ScopedIpcMain, channel: string): void;
    /** @internal */
    _scopeDidRemoveListener(_scope: ScopedIpcMain, channel: string): void;
    /** @internal */
    _scopeDidAddHandler(_scope: ScopedIpcMain, channel: string): void;
    /** @internal */
    _scopeDidRemoveHandler(_scope: ScopedIpcMain, channel: string): void;
    private dispatchInvoke;
    private dispatchOneWay;
    private unpackOneWayParams;
    private findScopedHandler;
    private getScopedIpcForSender;
    private getInvokeHandlerChannels;
    private getOneWayListenerChannels;
    private hasAnyInvokeHandler;
    private hasAnyOneWayListener;
    private unregisterHandlerWithServer;
    private unregisterListenerWithServerIfUnused;
    private ipcListenerCount;
    private installInternalErrorListener;
    private createInvokeEvent;
    private createEventSender;
    private resolveSenderWindow;
}
export declare class ScopedIpcMain extends EventEmitter {
    private readonly root;
    private readonly ownerKind;
    private readonly getWebContents;
    private readonly getFrame;
    private readonly internalErrorListener;
    private readonly handlers;
    private readonly listenerChannels;
    private disposed;
    constructor(root: IpcMain, ownerKind: ScopedIpcOwnerKind, getWebContents: () => WebContents | null, getFrame: (() => WebFrameMain | null) | undefined);
    on(channel: string, listener: IpcMainListener): this;
    once(channel: string, listener: IpcMainListener): this;
    addListener(channel: string, listener: IpcMainListener): this;
    prependListener(channel: string, listener: IpcMainListener): this;
    prependOnceListener(channel: string, listener: IpcMainListener): this;
    off(channel: string, listener: IpcMainListener): this;
    removeListener(channel: string, listener: IpcMainListener): this;
    removeAllListeners(channel?: string | symbol): this;
    handle(channel: string, handler: IpcMainHandler): void;
    handleOnce(channel: string, handler: IpcMainHandler): void;
    removeHandler(channel: string): void;
    /** @internal */
    _dispose(): void;
    /** @internal */
    _matches(webContents: WebContents, ownerKind: ScopedIpcOwnerKind, senderFrame: WebFrameMain | null): boolean;
    /** @internal */
    _hasHandler(channel: string): boolean;
    /** @internal */
    _hasListeners(channel: string): boolean;
    /** @internal */
    _handlerChannels(): Iterable<string>;
    /** @internal */
    _listenerChannels(): Iterable<string>;
    /** @internal */
    _invokeHandler(channel: string, event: IpcMainInvokeEvent, args: unknown[]): Promise<unknown>;
    /** @internal */
    _emitChannel(channel: string, event: IpcMainEvent, args: unknown[]): void;
    private registerIPCListenerChannel;
    private removeIPCListenerChannelIfEmpty;
    private ipcListenerCount;
    private installInternalErrorListener;
}
export declare function createScopedIpcMain(ownerKind: ScopedIpcOwnerKind, getWebContents: () => WebContents | null, getFrame?: () => WebFrameMain | null): ScopedIpcMain;
/**
 * Singleton instance of IpcMain
 */
export declare const ipcMain: IpcMain;
