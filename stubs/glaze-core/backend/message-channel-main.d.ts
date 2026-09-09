import { EventEmitter } from "node:events";
export interface MessagePortMainMessageEvent {
    data: unknown;
    ports: MessagePortMain[];
}
type QueuedMessage = {
    data: unknown;
    ports: MessagePortMain[];
};
type PortEndpoint = {
    closed: boolean;
    closeQueued: boolean;
    owner: MessagePortMain | null;
    queue: QueuedMessage[];
    remote: PortEndpoint | null;
    remoteClosed: boolean;
    started: boolean;
};
export declare class MessagePortMain extends EventEmitter {
    private closeEmitted;
    private endpoint;
    /** @internal */
    static _validateTransferList(transfer: MessagePortMain[] | undefined, sourcePort?: MessagePortMain): MessagePortMain[];
    constructor(endpoint: PortEndpoint);
    postMessage(message?: unknown, transfer?: MessagePortMain[]): void;
    start(): void;
    close(): void;
    on(event: "message", listener: (event: MessagePortMainMessageEvent) => void): this;
    on(event: "close", listener: () => void): this;
    once(event: "message", listener: (event: MessagePortMainMessageEvent) => void): this;
    once(event: "close", listener: () => void): this;
    off(event: "message", listener: (event: MessagePortMainMessageEvent) => void): this;
    off(event: "close", listener: () => void): this;
    /** @internal */
    _detachForTransfer(index: number): MessagePortMain;
    private transferPorts;
    private detachForTransfer;
    private flush;
    private emitRemoteClose;
    private queueRemoteClose;
    private emitClose;
}
export declare class MessageChannelMain extends EventEmitter {
    readonly port1: MessagePortMain;
    readonly port2: MessagePortMain;
    constructor();
}
export {};
