/**
 * Glaze Framework - Context Bridge (cross-world, native-mediated)
 *
 * With WKContentWorld isolation the preload script runs in an isolated JS
 * world while page code lives in another. Instead of directly setting
 * properties on `window`, this module:
 *
 * 1. Walks the API tree and classifies every leaf as data or function.
 * 2. Registers each function with `window.__glazePreloadBridge` (preload world).
 * 3. Sends a shape descriptor to native via
 *    `window.webkit.messageHandlers["glaze-bridge-register"]`.
 * 4. The native side generates proxy stubs in the requested target world so
 *    code in that world can call `window.<apiKey>.*` transparently.
 */
export interface ExecutionScript {
    func: (...args: any[]) => any;
    args?: any[];
}
/**
 * Context Bridge — sends an API shape descriptor to the native layer so
 * it can materialise proxy stubs in the requested target content-world.
 */
declare class ContextBridge {
    private exposedKeysByWorld;
    private executeCounter;
    private fnCounter;
    /**
     * Expose an API to the main world (page content-world) via the native
     * bridge. Functions are registered in the preload bridge; everything
     * else is serialised as data inside the shape descriptor.
     *
     * @param apiKey - Key the page world will see on `window` (e.g. 'glazeAPI')
     * @param api    - The API object to expose
     */
    exposeInMainWorld(apiKey: string, api: unknown): void;
    /**
     * Expose an API to a specific isolated world.
     *
     * World `0` targets the page world and world `999` targets the preload
     * content world. Other integer IDs map to stable named `WKContentWorld`s.
     *
     * @param worldId - Integer content-world ID (`0`, `999`, or app-defined `1000+`)
     * @param apiKey  - Key the target world will see on `window`
     * @param api     - The API value to expose
     */
    exposeInIsolatedWorld(worldId: number, apiKey: string, api: unknown): void;
    /**
     * Execute a serialized function in the page world.
     *
     * In the legacy no-isolation fallback this can run synchronously because
     * preload and page code share the same JS world. With WKContentWorld
     * isolation this uses a temporary page-world script and a tagged
     * structured-clone envelope. It is a useful synchronous partial, not
     * Electron's full V8 context bridge value matrix.
     */
    executeInMainWorld(executionScript: ExecutionScript): any;
    private exposeInWorld;
    private executeInPageWorld;
    private buildShape;
    private exposeDirectly;
    private deepFreeze;
    private isBlockedBridgeValue;
    private snapshotDataValue;
    private cloneBridgeValue;
}
/**
 * Singleton instance of ContextBridge.
 */
export declare const contextBridge: ContextBridge;
export type { ContextBridge };
/**
 * Type helper for defining window APIs
 *
 * @example
 * ```typescript
 * declare global {
 *   interface Window {
 *     glazeAPI: {
 *       getAppInfo: () => Promise<{ name: string; version: string }>;
 *       onThemeChange: (callback: (theme: string) => void) => void;
 *     };
 *   }
 * }
 * ```
 */
export type ExposeInMainWorld<T> = {
    [K in keyof T]: T[K];
};
export type ExposeInIsolatedWorld<T> = {
    [K in keyof T]: T[K];
};
