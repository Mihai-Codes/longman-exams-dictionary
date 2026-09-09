/**
 * Renderer-facing App AI bridge.
 *
 * Registers a narrow, typed IPC surface (`glaze:ai:generateText` and
 * `glaze:ai:streamText`) so an app's
 * renderer can trigger Glaze-billed AI generation via `useGlazeAI()` without
 * hand-rolling IPC. The actual `@ai-sdk` call still runs here, in the app's
 * main process — the renderer only ever sees `{ text, usage }` or a typed
 * `GlazeAIError` state, never a token or a raw SDK error.
 *
 * The renderer-facing surface intentionally stays text-only. Structured output
 * and tools spend the user's credits too, but need separate serialization and
 * error-mapping reviews before they cross this bridge.
 *
 * Import-cycle note: this file does NOT import `glaze()` from `../ai/provider.ts`
 * (or the `@glaze/core/ai` barrel), even though that's where the token-aware
 * Anthropic-via-Glaze model already exists. Two reasons, confirmed empirically
 * (rebuilding + running the full test suite):
 *
 * 1. Build-time: `provider.ts` imports `AppAiTokenError`/`acquireAppAiToken` via
 *    the bare `@glaze/core/backend` specifier (required — see reason 2). This
 *    module is bundled into `backend.js` (see `src/backend/index.ts`), which
 *    IS `@glaze/core/backend`. Reaching `provider.ts` from here would make
 *    esbuild try to resolve `@glaze/core/backend` while backend.js is still
 *    being built — a self-referential resolution with no built output yet.
 * 2. Test-time (the one that actually broke): several tests import
 *    `src/backend/index.ts` directly as TS source (bypassing the built dist)
 *    to exercise singleton state such as `app-ready-state.ts`. Any bare
 *    `@glaze/core/*` specifier reachable from that source graph resolves via
 *    package self-reference to the *built* `ai.js`/`backend.js` — a second,
 *    disconnected module tree with its own copies of that singleton state
 *    (`process-extensions.test.ts` failed this way: it set the app-ready flag
 *    on the source-loaded copy, but the built-dist copy pulled in
 *    transitively still saw it unset). `provider.ts` itself must keep the bare
 *    specifier (`acquireAppAiToken`'s pending-mint promise is resolved from
 *    `registerAppAiCrossAppHandler` elsewhere in backend.js and MUST be the
 *    same instance in production), so the fix is for THIS file to route
 *    around it rather than change `provider.ts`.
 *
 * So this module builds its token-aware Anthropic wrapper from the shared,
 * acquirer-agnostic `../ai/glaze-anthropic.js` leaf (which has zero
 * `@glaze/core` imports of its own), feeding it a resolver built on
 * same-directory `./app-ai-token-runtime.js` — that resolver always resolves
 * to a single module instance regardless of whether this file is loaded from
 * source or from the built `backend.js`.
 *
 * Lazy SDK load: `@ai-sdk/anthropic` + `ai` are only reachable via the dynamic
 * `import()` in `ensureAiSdkLoaded()` below, deferred until the first text
 * generation call. `registerAppAiIpcBridge()` itself stays
 * synchronous and SDK-free so apps that never call the AI bridge don't pay for
 * it at boot — this is the documented "rare heavy-dependency" exception to the
 * static-import rule.
 */
import { type LanguageModelUsage, type ModelMessage } from "ai";
import { type GlazeAIErrorState } from "../ai/errors.js";
import { type AppAiPermissionState } from "./app-ai-token-runtime.js";
import { type IPCStreamRequestContext } from "./types.js";
export declare const GLAZE_AI_GENERATE_TEXT_CHANNEL = "glaze:ai:generateText";
export declare const GLAZE_AI_STREAM_TEXT_CHANNEL = "glaze:ai:streamText";
export declare const GLAZE_AI_PERMISSION_STATE_CHANNEL = "glaze:ai:getPermissionState";
/** Mirrors `GLAZE_AI_OPEN_LIMITS_CHANNEL` in `use-glaze-ai.ts` — kept in sync by hand,
 *  same convention as `GLAZE_AI_GENERATE_TEXT_CHANNEL` above (the renderer hook can't
 *  import this Node-only module; see the file header's browser-bundle rationale). */
export declare const GLAZE_AI_OPEN_LIMITS_CHANNEL = "glaze:ai:openAiLimits";
/** Mirrors `GLAZE_AI_TOKEN_READY_CHANNEL` in `use-glaze-ai.ts` (same hand-kept-in-sync
 *  convention). Broadcast whenever a token arrives out-of-band — i.e. after some earlier
 *  `acquireAppAiToken()` call already gave up — so a still-mounted renderer showing a
 *  `needs-subscription` blocked state (see C5's upsell flow) can clear it without the
 *  user needing to do anything beyond retrying their action. See
 *  `onAppAiTokenIssued`'s doc in app-ai-token-runtime.ts. */
export declare const GLAZE_AI_TOKEN_READY_CHANNEL = "glaze:ai:tokenReady";
/** Mirrors `GLAZE_AI_ENABLE_CHANNEL` in `use-glaze-ai.ts` (same hand-kept-in-sync
 *  convention). Backs `useGlazeAI().enableInHost()` — the `host-unavailable`
 *  blocked-state CTA (D3) — by deep-linking into the host's `app-ai/request`
 *  consent/mint flow. See `enableAppAiInHost`'s doc in app-ai-token-runtime.ts. */
export declare const GLAZE_AI_ENABLE_CHANNEL = "glaze:ai:enableInHost";
/** Mirrors `GLAZE_AI_UPGRADE_CHANNEL` in `use-glaze-ai.ts` (same hand-kept-in-sync
 *  convention). Backs `useGlazeAI().upgradeInHost()` — see `upgradeAppAiInHost`'s
 *  doc in app-ai-token-runtime.ts. */
export declare const GLAZE_AI_UPGRADE_CHANNEL = "glaze:ai:upgradeInHost";
/** Text-generation options with exactly one of `prompt` or `messages`, matching the AI SDK prompt contract. */
export type GlazeAiGenerateTextOptions = {
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
export type GlazeAiGenerateTextResult = {
    ok: true;
    text: string;
    usage: LanguageModelUsage;
} | {
    ok: false;
    state: GlazeAIErrorState;
    message: string;
} | {
    ok: false;
    cancelled: true;
};
export interface GlazeAiStreamTextChunk {
    type: "text-delta";
    delta: string;
}
export interface GlazeAiPermissionStateResult {
    permissionState: AppAiPermissionState;
}
/**
 * Pure error -> typed-result mapping seam, unit tested without any IPC/SDK
 * mocking. Returns `null` for anything that isn't a Glaze-level block so the
 * caller rethrows it unchanged (ordinary AI SDK / network errors surface as
 * ordinary IPC rejections, not a blocked state).
 */
export declare function mapAppAiGenerateTextError(error: unknown): GlazeAiGenerateTextResult | null;
export declare function forwardAppAiTextStream(textStream: AsyncIterable<string>, sendChunk: (chunk: GlazeAiStreamTextChunk) => void, signal: AbortSignal): Promise<string>;
/** Runs the AI SDK's `streamText` and forwards text deltas as bridge chunks. */
export declare function runAiSdkTextStream(params: {
    streamText: typeof import("ai").streamText;
    model: import("ai").LanguageModel;
    options: GlazeAiGenerateTextOptions;
    sendChunk: (chunk: GlazeAiStreamTextChunk) => void;
    signal: AbortSignal;
}): Promise<{
    text: string;
    usage: LanguageModelUsage;
}>;
/** `glaze:ai:streamText` handler; exported for transport-cancellation regression tests. */
export declare function runStreamText(options: GlazeAiGenerateTextOptions, sendChunk: (chunk: GlazeAiStreamTextChunk) => void, context: IPCStreamRequestContext): Promise<GlazeAiGenerateTextResult>;
/** Registers the renderer-facing `glaze:ai:*` IPC bridge. Idempotent. */
export declare function registerAppAiIpcBridge(): void;
