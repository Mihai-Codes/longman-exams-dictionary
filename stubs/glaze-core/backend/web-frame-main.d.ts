import { EventEmitter } from "events";
import { type ScopedIpcMain } from "./ipc-main.js";
import { type MessagePortMain } from "./message-channel-main.js";
import { type WebContents } from "./web-contents.js";
export interface WebFrameMainEvents {
    "dom-ready": () => void;
}
export interface WebFrameMainInit {
    frameTreeNodeId?: number;
    frameToken?: string;
    name?: string;
    parent?: WebFrameMain | null;
    processId?: number;
    routingId?: number;
    url?: string;
}
export declare class WebFrameMain extends EventEmitter {
    private readonly webContents;
    readonly frameTreeNodeId: number;
    readonly frameToken: string;
    readonly name: string;
    readonly routingId: number;
    private currentURL;
    private detachedState;
    private parentFrame;
    private readonly processIdValue;
    private readonly scopedIpc;
    constructor(webContents: WebContents, init?: WebFrameMainInit);
    /** @internal */
    _getWebContents(): WebContents;
    /** @internal */
    _emitDomReady(): void;
    /** @internal */
    _setURL(url: string): void;
    /** @internal */
    _setParent(parent: WebFrameMain | null): void;
    /** @internal */
    _detach(): void;
    get ipc(): ScopedIpcMain;
    get url(): string;
    get origin(): string;
    get top(): WebFrameMain | null;
    get parent(): WebFrameMain | null;
    get frames(): WebFrameMain[];
    get framesInSubtree(): WebFrameMain[];
    get osProcessId(): number;
    get processId(): number;
    get visibilityState(): DocumentVisibilityState;
    get detached(): boolean;
    executeJavaScript<T = unknown>(code: string, userGesture?: boolean): Promise<T>;
    reload(): boolean;
    isDestroyed(): boolean;
    send(channel: string, ...args: unknown[]): void;
    postMessage(channel: string, message: unknown, transfer?: MessagePortMain[]): void;
    collectJavaScriptCallStack(): Promise<string | void>;
    on<K extends keyof WebFrameMainEvents>(event: K, listener: WebFrameMainEvents[K]): this;
    once<K extends keyof WebFrameMainEvents>(event: K, listener: WebFrameMainEvents[K]): this;
    off<K extends keyof WebFrameMainEvents>(event: K, listener: WebFrameMainEvents[K]): this;
    emit<K extends keyof WebFrameMainEvents>(event: K, ...args: Parameters<WebFrameMainEvents[K]>): boolean;
    removeListener<K extends keyof WebFrameMainEvents>(event: K, listener: WebFrameMainEvents[K]): this;
}
export declare const webFrameMain: {
    fromId(processId: number, routingId: number): WebFrameMain | undefined;
    fromFrameToken(processId: number, frameToken: string): WebFrameMain | null;
};
