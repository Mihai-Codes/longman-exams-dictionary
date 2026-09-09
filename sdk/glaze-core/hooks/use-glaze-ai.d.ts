import { type LanguageModelUsage, type ModelMessage } from "ai";
import { GlazeAIError, type GlazeAIErrorState } from "../ai/errors";
/** Matches `GlazeAiGenerateTextOptions` in `@glaze/core/backend`'s app-ai-bridge.
 *  Prompt exclusivity mirrors the AI SDK's own `Prompt` type: exactly one of
 *  `prompt`/`messages` (the bridge enforces it at runtime too, for JS callers). */
export type UseGlazeAIGenerateOptions = {
    /** Grade alias ("fast" | "smart" | "powerful") or an exact model id. */
    model: "fast" | "smart" | "powerful" | (string & {});
    /** Canonical AI SDK name; `system` remains accepted as the SDK's deprecated alias. */
    instructions?: string;
    system?: string;
    maxOutputTokens?: number;
} & ({
    prompt: string;
    messages?: never;
} | {
    messages: ModelMessage[];
    prompt?: never;
});
export interface UseGlazeAIGenerateResult {
    text: string;
    usage: LanguageModelUsage;
}
export type UseGlazeAIStreamOptions = UseGlazeAIGenerateOptions & {
    /** Receives each incremental text delta. */
    onTextDelta: UseGlazeAITextDeltaHandler;
    /** Stops the backend model request and rejects with an AbortError. */
    abortSignal?: AbortSignal;
};
export type UseGlazeAITextDeltaHandler = (delta: string) => void;
export declare const GLAZE_AI_GENERATE_TEXT_CHANNEL = "glaze:ai:generateText";
export declare const GLAZE_AI_STREAM_TEXT_CHANNEL = "glaze:ai:streamText";
export declare const GLAZE_AI_PERMISSION_STATE_CHANNEL = "glaze:ai:getPermissionState";
export type GlazeAIPermissionState = "checking" | "granted" | "not-granted" | "unknown";
type ResolvedGlazeAIPermissionState = Exclude<GlazeAIPermissionState, "checking">;
/** Mirrors `GLAZE_AI_OPEN_LIMITS_CHANNEL` in `app-ai-bridge.ts` — kept in sync by hand,
 *  same convention as `GLAZE_AI_GENERATE_TEXT_CHANNEL` above. */
export declare const GLAZE_AI_OPEN_LIMITS_CHANNEL = "glaze:ai:openAiLimits";
/** Mirrors `GLAZE_AI_TOKEN_READY_CHANNEL` in `app-ai-bridge.ts` — same hand-kept-in-sync
 *  convention. Broadcast when a token arrives out-of-band (see that file's doc); this
 *  hook uses it to clear a `needs-subscription` block once the user has upgraded (C5),
 *  without a page reload or manual re-check. */
export declare const GLAZE_AI_TOKEN_READY_CHANNEL = "glaze:ai:tokenReady";
/** Mirrors `GLAZE_AI_ENABLE_CHANNEL` in `app-ai-bridge.ts` — same hand-kept-in-sync
 *  convention. Backs `enableInHost()` below. */
export declare const GLAZE_AI_ENABLE_CHANNEL = "glaze:ai:enableInHost";
/** Mirrors `GLAZE_AI_UPGRADE_CHANNEL` in `app-ai-bridge.ts` — same hand-kept-in-sync
 *  convention. Backs `upgradeInHost()` below. */
export declare const GLAZE_AI_UPGRADE_CHANNEL = "glaze:ai:upgradeInHost";
export type GlazeAIStatus = "idle" | "loading" | "ready" | GlazeAIErrorState;
export interface GlazeAIHookState {
    status: GlazeAIStatus;
    error: GlazeAIError | Error | null;
}
export declare const INITIAL_GLAZE_AI_STATE: GlazeAIHookState;
export type GlazeAIAction = {
    type: "start";
} | {
    type: "success";
} | {
    type: "blocked";
    state: GlazeAIErrorState;
    error: GlazeAIError;
} | {
    type: "failed";
    error: Error;
} | {
    type: "reset";
};
/** Pure state-transition seam, unit tested without rendering the hook. */
export declare function glazeAIReducer(state: GlazeAIHookState, action: GlazeAIAction): GlazeAIHookState;
/**
 * Pure predicate for the `tokenReady` listener below, unit tested without rendering
 * the hook (same rationale as `glazeAIReducer`). A `tokenReady` push only ever fires
 * after the host has actually minted and persisted a real token, so it's an
 * unambiguous "unblock" signal regardless of which blocked/error state the hook was
 * in — the only statuses that should NOT be reset are `ready` (nothing to clear) and
 * `loading` (an in-flight call owns the next transition).
 */
export declare function shouldResetOnTokenReady(status: GlazeAIStatus): boolean;
export interface UseGlazeAIResult {
    /** Runs `generateText` in the app's main process. Rejects with `GlazeAIError` for a
     *  blocked state (render a short message for `error.state`), or the raw
     *  error otherwise. */
    generate: (opts: UseGlazeAIGenerateOptions) => Promise<UseGlazeAIGenerateResult>;
    /** Streams text deltas through `opts.onTextDelta` and resolves with the full result.
     *  Pass `opts.abortSignal` to stop the model request. */
    streamText: (opts: UseGlazeAIStreamOptions) => Promise<UseGlazeAIGenerateResult>;
    /**
     * Consent-only state for the AI grades declared by this app. It is checked
     * automatically on mount and does not generate content, spend credits,
     * launch Glaze, or present consent/account UI.
     */
    permissionState: GlazeAIPermissionState;
    /** Re-checks the host's authoritative consent state. */
    refreshPermissionState: () => Promise<GlazeAIPermissionState>;
    /** Also reflected in `error` for blocked states — read this to drive your blocked-state copy. */
    state: GlazeAIStatus;
    error: GlazeAIError | Error | null;
    /** Clears a blocked/failed state back to idle (e.g. before a manual retry). */
    reset: () => void;
    /**
     * Deep-links into the host's AI Permissions settings, focused on this app,
     * so the user can raise their per-app daily cap after a
     * `daily-limit-reached` block. Resolves once the deep link has been
     * dispatched; never throws — a missing host is a silent no-op, since
     * there's no in-app fallback.
     */
    openLimits: () => Promise<void>;
    /**
     * Deep-links into the host to (re)request app-AI consent/minting — e.g. so
     * the user can launch Glaze from a fully closed state and get consented.
     * Use it for `host-unavailable` (Glaze fully closed — no dialog can appear
     * without it). For `needs-consent`, simply generating again re-prompts.
     *
     * Resolves once the deep link has been dispatched; never throws — a
     * missing host is a silent no-op, same as `openLimits`. Does not itself
     * wait for a token: once the host mints, the token arrives via the same
     * out-of-band `tokenReady` push used for C5's post-upsell mint, which
     * resets this hook's blocked state AND auto-resumes the last request (see
     * the effect below). Do not subscribe to `tokenReady` yourself or wire
     * `retry()` to it — a caller-side retry on the same signal double-fires
     * the request.
     */
    enableInHost: () => Promise<void>;
    /**
     * Deep-links into the host's upgrade flow (the App AI upsell — its
     * "Upgrade to Pro" drives checkout and mints on completion). Unlike the
     * other deep links this one activates the host: the user explicitly asked
     * to upgrade, and a URL open is a user-initiated activation that reliably
     * fronts the host window. Rarely needed: a fresh generate re-prompts the
     * upsell on its own; this exists for custom upgrade affordances.
     * After checkout completes the token arrives via the `tokenReady` push and
     * this hook resets and auto-resumes the last request on its own; never add
     * retry wiring on top. Resolves once dispatched; never throws (missing
     * host = no-op).
     */
    upgradeInHost: () => Promise<void>;
    /**
     * Re-runs the most recent `generate` or `streamText` call (a no-op that
     * resolves `undefined` if neither has been called yet, or if the last
     * stream's signal is already aborted). Wire it to explicit user actions
     * only — e.g. a "Try again" button after a failure, or resuming a stream
     * that already delivered partial output (which the automatic resume below
     * deliberately skips so deltas aren't replayed into visible text).
     *
     * Never call it from a `tokenReady` subscription: once the host mints a
     * token, the effect below already resets the blocked state and re-runs
     * the last request itself, for *any* blocked/error state (a Stripe
     * checkout or cold-launch mint routinely outlasts the mint timeout, so
     * the original call has usually already rejected — the auto-resume is
     * what gets the user their result without resubmitting). A caller-side
     * retry on the same signal starts a second concurrent request: overlapping
     * streams share `onTextDelta`, so their deltas interleave into the UI.
     */
    retry: () => Promise<UseGlazeAIGenerateResult> | undefined;
}
/**
 * Pure predicate for the `tokenReady` auto-resume: a stream request may only be
 * re-run automatically while it has delivered zero deltas (a blocked stream never
 * emits output, so this is the normal blocked case). After partial output an
 * automatic re-run would replay every delta into the app's `onTextDelta` — which
 * typically appends to visible text — so it needs an explicit user action instead.
 */
export declare function shouldAutoResumeStream(request: {
    deliveredOutput: boolean;
    aborted: boolean;
}): boolean;
export declare function isGlazeAIAbortError(error: unknown): boolean;
export declare function createGlazeAIAbortError(reason?: unknown): DOMException;
interface GlazeAIStreamingIPC {
    stream<TChunk = unknown, TResult = unknown>(channel: string, args: unknown, onChunk: (chunk: TChunk) => void, options?: {
        cancellationId?: string;
    }): Promise<TResult>;
    cancelStream?: (cancellationId: string) => void;
}
interface GlazeAIInvokeIPC {
    invoke<TResult = unknown>(channel: string, args?: unknown): Promise<TResult>;
}
export declare function shouldApplyGlazeAIPermissionResult(resultSeq: number, currentSeq: number): boolean;
export declare function permissionStateForCompletedCheck(resultSeq: number, currentSeq: number, result: ResolvedGlazeAIPermissionState, currentPermissionState: GlazeAIPermissionState): GlazeAIPermissionState;
export declare function permissionStateForGenerationOutcome(outcome: "success" | GlazeAIErrorState, currentPermissionState: GlazeAIPermissionState): ResolvedGlazeAIPermissionState | null;
/** Renderer-side permission request seam, exported for integration tests. */
export declare function requestGlazeAIPermissionState(ipc: GlazeAIInvokeIPC): Promise<ResolvedGlazeAIPermissionState>;
/** Renderer-side streaming request seam, exported for integration tests. */
export declare function requestGlazeAITextStream(ipc: GlazeAIStreamingIPC, opts: UseGlazeAIStreamOptions): Promise<UseGlazeAIGenerateResult>;
/**
 * Renderer-side hook for the App AI bridge auto-registered by the glaze-core
 * runtime bootstrap (`registerAppAiIpcBridge`, see `src/backend/app-ai-bridge.ts`).
 * Exposes one-shot and streaming text generation while keeping tokens and raw
 * provider errors inside the app's main process.
 */
export declare function useGlazeAI(): UseGlazeAIResult;
export {};
