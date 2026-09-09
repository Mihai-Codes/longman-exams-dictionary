export interface GlazeCrossAppChannelOptions {
    appRoot?: string;
    enabled?: boolean;
    sessionToken: string;
}
export interface GlazeCrossAppSessionInfo {
    version: number;
    pid: number;
    startedAt: string;
    appId: string | null;
    projectId: string | null;
    appName: string | null;
    productName: string | null;
    runtimeRoot: string;
    sourcesRoot: string;
    sessionToken: string;
    transport: "xpc";
}
export interface GlazeCrossAppRequest {
    method: string;
    payload?: unknown;
}
export interface GlazeCrossAppChannelHandle {
    session: GlazeCrossAppSessionInfo;
    stop(): Promise<void>;
}
interface GlazeCrossAppBackendPayload {
    request: GlazeCrossAppRequest;
    session: GlazeCrossAppSessionInfo;
}
export interface GlazeCrossAppControllerCallerIdentity {
    bundleIdentifier: string;
    executablePath: string;
}
type GlazeCrossAppExtensionRequestHandler = (payload: GlazeCrossAppBackendPayload) => Promise<unknown | typeof GLAZE_CROSS_APP_REQUEST_UNHANDLED> | unknown | typeof GLAZE_CROSS_APP_REQUEST_UNHANDLED;
export declare const GLAZE_CROSS_APP_REQUEST_UNHANDLED: unique symbol;
export declare function registerGlazeCrossAppRequestHandler(handler: GlazeCrossAppExtensionRequestHandler): void;
type GlazeCrossAppControllerRequestHandler = (request: GlazeCrossAppRequest, caller: GlazeCrossAppControllerCallerIdentity) => Promise<unknown | typeof GLAZE_CROSS_APP_REQUEST_UNHANDLED> | unknown | typeof GLAZE_CROSS_APP_REQUEST_UNHANDLED;
export declare function registerGlazeCrossAppControllerRequestHandler(handler: GlazeCrossAppControllerRequestHandler): void;
/**
 * The app's own id, derived exactly as the cross-app channel derives it when registering this
 * app's identity — so the App AI token runtime and the channel can never disagree (a mismatch
 * makes the host's token push fail to correlate). Single source of truth for both; see
 * app-ai-token-runtime's deriveOwnAppId, which delegates here.
 */
export declare function resolveOwnGlazeAppId(explicitAppRoot?: string): string | null;
/**
 * Holds the cross-app session open past the idle timeout while an async
 * operation is awaiting an inbound push. App AI token minting needs this: the
 * app sends `appAi.requestToken`, the request/response acks, and then it waits
 * — through a consent or Pro-upsell flow that can run for minutes — for the
 * separate `appAi.tokenIssued` push. Both the broker session record (10min TTL)
 * and the mint wait (up to 7min) are sized for that, but the 90s idle timer is
 * not; without this hold it would tear the receiving session down mid-consent
 * and the push would have nowhere to land.
 *
 * Returns an idempotent release. The normal idle countdown resumes once the
 * last outstanding hold is released.
 */
export declare function holdCrossAppSessionOpen(): () => void;
/**
 * Sends a request to the running Glaze host's controller over the cross-app
 * broker, self-registering a session first if needed. Throws when no host
 * controller is registered (host not running) or the channel is disabled —
 * callers (e.g. App AI token minting) fall back to a URL-scheme deep link,
 * which cold-launches the host.
 */
export declare function sendGlazeHostControllerRequest(request: GlazeCrossAppRequest, options?: Omit<GlazeCrossAppChannelOptions, "sessionToken">): Promise<unknown>;
export declare function registerGlazeCrossAppIPCHandlers(): void;
export declare function installGlazeCrossAppBootstrapListener(options?: Omit<GlazeCrossAppChannelOptions, "sessionToken">): void;
export declare function startGlazeCrossAppChannel(options: GlazeCrossAppChannelOptions): Promise<GlazeCrossAppChannelHandle | null>;
export {};
