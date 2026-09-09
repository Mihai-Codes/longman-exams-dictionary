/**
 * Lightweight opt-in trace helpers for renderer-side diagnostics that need to
 * correlate with native `[PortalTrace]` entries from PortalWindowController.
 *
 * Enabled by either:
 *   - `localStorage.setItem("GlazePortalTraceEnabled", "1")`
 *   - `window.__GLAZE_PORTAL_TRACE__ = true`
 *
 * Logs go through `console.info` so they are captured by the renderer log
 * forwarder used in internal builds.
 */
export declare function glazeTooltipTrace(event: string, metadata?: Record<string, unknown>): void;
export declare function glazeNativeViewTrace(event: string, metadata?: Record<string, unknown>): void;
export declare function glazeHeartbeatTrace(event: string, metadata?: Record<string, unknown>): void;
export declare function isGlazeTraceEnabled(): boolean;
