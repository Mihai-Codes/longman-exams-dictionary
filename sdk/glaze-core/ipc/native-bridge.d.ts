import { NativeBridge } from "./types";
declare class WebKitBridge implements NativeBridge {
    private pendingRequests;
    private messageCounter;
    constructor();
    request(method: string, params?: unknown): Promise<unknown>;
    private handleMessage;
}
export declare const nativeBridge: WebKitBridge;
export {};
