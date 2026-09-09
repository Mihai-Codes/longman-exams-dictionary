/**
 * Backend Native Bridge
 *
 * Allows Node.js backend to call Swift native methods directly.
 * This is different from the renderer native bridge (which uses WebKit messages).
 *
 * Architecture:
 * - Backend sends special IPC messages on "__native:*" channels
 * - These are intercepted by Swift and routed to NativeMethodRegistry
 * - Responses come back through the same mechanism
 */
import { type GlazeIPCServer } from "./ipc.js";
interface NativeBridgeResponse {
    id: string;
    result?: any;
    error?: string | {
        message?: string;
        code?: unknown;
        nativeErrorDomain?: unknown;
        nativeErrorCode?: unknown;
    };
}
interface NativeCallOptions {
    timeoutMs?: number;
}
declare class BackendNativeBridge {
    private static instance;
    private ipcServer;
    private pendingRequests;
    private timedOutRequests;
    private messageCounter;
    private windows;
    private notificationHandlers;
    private wireHandlers;
    static getInstance(): BackendNativeBridge;
    /**
     * Wire the bridge to the IPC server
     * Call this during app initialization
     */
    wireToServer(ipcServer: GlazeIPCServer): void;
    isWired(): boolean;
    onWired(handler: () => void): () => void;
    /**
     * Call a native Swift method from the backend
     *
     * This sends a special "native:" prefixed message through the IPC transport
     * that Swift intercepts and routes to NativeMethodRegistry
     */
    callNative(method: string, params?: any, options?: NativeCallOptions): Promise<any>;
    private timeoutMsForMethod;
    private trackTimedOutRequest;
    /**
     * Handle a response from Swift
     * Called when Swift sends back a native method response
     */
    handleResponse(response: NativeBridgeResponse): void;
    /**
     * Register a window to receive events
     */
    registerWindow(windowId: string, window: any): void;
    /**
     * Unregister a window (when closed/destroyed)
     */
    unregisterWindow(windowId: string): void;
    /**
     * Dispatch an event to a specific window
     * Called when Swift sends window lifecycle events
     */
    dispatchWindowEvent(windowId: string, eventName: string, ...args: any[]): void;
    /**
     * @deprecated BrowserWindow now handles close lifecycle through _handleNativeEvent.
     */
    handleNativeWindowClose(windowId: string): void;
    /**
     * Register a notification handler
     * Called when native sends notifications to the backend
     *
     * @param method - Notification method name (e.g., 'globalShortcut:triggered')
     * @param handler - Function to call when notification is received
     * @returns Unsubscribe function
     */
    onNotification(method: string, handler: (params: unknown) => void): () => void;
    /**
     * Handle a notification from native (Swift)
     * Called when Swift sends a notification via stdio bridge
     */
    handleNotification(method: string, params: unknown): void;
}
/**
 * Global instance of the backend native bridge
 */
export declare const backendNativeBridge: BackendNativeBridge;
export {};
