export interface StoredAppAiToken {
    token: string;
    refreshToken: string;
    expiresAt: string;
    apiBaseUrl: string;
}
export type AppAiPermissionState = "granted" | "not-granted" | "unknown";
export declare class AppAiTokenError extends Error {
    reason: "host-unavailable" | "denied" | "needs-subscription" | "signed-out";
    constructor(reason: "host-unavailable" | "denied" | "needs-subscription" | "signed-out", message: string);
}
export declare function clearStoredAppAiToken(): void;
declare function isTokenFresh(stored: Pick<StoredAppAiToken, "expiresAt">): boolean;
declare function createPendingMint(timeoutMs: number): Promise<StoredAppAiToken>;
declare function resolvePendingMint(stored: StoredAppAiToken): void;
export declare function onAppAiTokenIssued(listener: () => void): () => void;
declare function rejectPendingMint(reason: string): void;
declare function deriveOwnAppId(): string | null;
/**
 * Queries the running host for this app's consent state without minting or
 * refreshing a token. Concurrent callers share only the in-flight request;
 * terminal results are deliberately not cached so later mounts can observe a
 * consent change. A missing/unreachable host and malformed responses are
 * represented as "unknown" and never fall back to a deep link.
 */
export declare function getAppAiPermissionState(): Promise<AppAiPermissionState>;
/**
 * Deep-links into the host's AI Permissions settings, focused on this app —
 * fired after a `daily-limit-reached` block via
 * `useGlazeAI().openLimits()` so the user can raise their per-app daily cap
 * without leaving the app. Best-effort: resolves `false` (never throws) if no
 * Glaze installation answers any candidate scheme, since this is a "try to
 * help" affordance, not a blocking requirement.
 */
export declare function openAiLimitsSettings(): Promise<boolean>;
/**
 * Deep-links into the host to open its credit top-up flow — fired automatically
 * (no app UI required) when an App AI generate surfaces the `insufficient-credits`
 * blocked state, so the user can top up without leaving the app. The host resolves
 * the right surface for the account's tier (top-up modal for pro/trial, upgrade
 * checkout for free, team request otherwise), mirroring the agent window's own
 * out-of-credits affordance.
 *
 * Activating (unlike the silent token-request path): the user is blocked and needs
 * to act, so the host fronts — same rationale as `upgradeAppAiInHost`. Throttled
 * per-process. Best-effort: resolves `false` (never throws) if throttled or if no
 * Glaze installation answers any candidate scheme, mirroring `openAiLimitsSettings`.
 */
export declare function openCreditsInHost(): Promise<boolean>;
/**
 * Deep-links into the host to (re)request app-AI consent/minting — fired from
 * a `host-unavailable` recovery affordance via
 * `useGlazeAI().enableInHost()` (D3) so the user has an explicit "Enable AI in
 * Glaze" action rather than a bare "open Glaze and hope it works out" link.
 *
 * Reuses the exact same `app-ai/request?appId=` deep link `requestMintFromHost()`
 * uses to mint: macOS cold-launches the host from this URL scheme if it isn't
 * running, and `application(_:open:)` queues the deeplink until both the UI and
 * the Node backend are ready (see `Application+MainAppDelegate.swift`), so
 * consent/minting still completes normally from a fully closed Glaze — no
 * separate "launch" step is needed.
 *
 * This call itself does NOT create a new pending-mint wait (unlike
 * `requestMintFromHost`, which is tied to a specific `acquireAppAiToken()`
 * call and its own 60s timeout) — it's a fire-and-forget deep link. Once the
 * host actually mints, the token arrives the same way a post-upsell mint does
 * (C5): via `appAi.tokenIssued` → persisted to disk → the `GLAZE_AI_TOKEN_READY_CHANNEL`
 * broadcast, which resets any blocked `useGlazeAI()` state (including a
 * `host-unavailable` call that already timed out) back to idle. Best-effort:
 * resolves `false` (never throws) if no Glaze installation answers any
 * candidate scheme, mirroring `openAiLimitsSettings`.
 */
export declare function enableAppAiInHost(): Promise<boolean>;
/**
 * The `needs-subscription` blocked-state CTA: routes through the same
 * `app-ai/request` flow as `enableAppAiInHost` (for a free-tier user the host
 * shows its upsell dialog, whose "Upgrade to Pro" drives checkout and mints on
 * completion — C5), but with `activate: true`. The user explicitly asked to
 * upgrade, and an OS-level URL open is a user-initiated activation, so the
 * host fronts reliably — unlike the host's own `mainWindow.focus`, which
 * macOS 14+ cooperative activation may grant without visibly raising the
 * window. Recovery needs no retry wiring in the app: the post-checkout mint
 * arrives via the `tokenReady` push, which resets blocked `useGlazeAI()`
 * state automatically. Best-effort like the other deep links.
 */
export declare function upgradeAppAiInHost(): Promise<boolean>;
export declare function acquireAppAiToken(opts?: {
    forceRefresh?: boolean;
    reconsent?: boolean;
}): Promise<{
    token: string;
    apiBaseUrl: string;
}>;
export declare function registerAppAiCrossAppHandler(): void;
/** @internal test seams */
export declare const __testing: {
    isTokenFresh: typeof isTokenFresh;
    createPendingMint: typeof createPendingMint;
    resolvePendingMint: typeof resolvePendingMint;
    rejectPendingMint: typeof rejectPendingMint;
    deriveOwnAppId: typeof deriveOwnAppId;
};
export {};
