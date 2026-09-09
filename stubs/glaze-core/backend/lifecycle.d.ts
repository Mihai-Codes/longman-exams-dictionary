/**
 * Glaze Framework - Lifecycle Management
 *
 * Handles application startup, shutdown, and process monitoring
 */
import { type ChildProcess } from "child_process";
export interface LifecycleCallbacks {
    onShutdown?: () => Promise<void> | void;
}
/**
 * True when an unhandled rejection is a Glaze AI control-flow error that should
 * be logged but NOT shut the backend down.
 *
 * Matches by `error.name` rather than `instanceof`: `lifecycle.ts` importing the
 * token-runtime / AI-error modules would create an import cycle, and — because
 * those classes can legitimately exist in two module instances at once (source
 * graph vs built `backend.js`; see the import-cycle notes in
 * `app-ai-bridge.ts`) — an `instanceof` check against one instance could miss an
 * error thrown from the other. The name is stable across both.
 */
export declare function isNonFatalGlazeAiRejection(reason: unknown): boolean;
/**
 * Tracks child processes spawned by the backend so they can be
 * cleaned up when the application shuts down.
 *
 * Without tracking, child processes (e.g. ffmpeg) become orphaned
 * and keep running after the Glaze app exits.
 */
declare class ChildProcessTracker {
    private processes;
    /** Register a child process for cleanup on shutdown. */
    track(child: ChildProcess): void;
    /** Unregister a child process (e.g. if you manage its lifecycle yourself). */
    untrack(child: ChildProcess): void;
    /**
     * Send SIGTERM to tracked children and escalate to SIGKILL if still alive after
     * a grace period. This method awaits the escalation window before returning.
     */
    killAll(): Promise<void>;
    private isPidAlive;
}
export declare const childProcessTracker: ChildProcessTracker;
export declare class GlazeLifecycle {
    private static isShuttingDown;
    private static readonly SHUTDOWN_TIMEOUT;
    private static callbacks;
    private static shutdownHooks;
    private static parentPid;
    private static monitorInterval;
    static setCallbacks(callbacks: LifecycleCallbacks): void;
    /**
     * Register a shutdown hook that runs during graceful shutdown.
     * Hooks execute in registration order, before the infrastructure teardown
     * (IPC server stop), so app-level resources can still use IPC during cleanup.
     */
    static onShutdown(hook: () => Promise<void> | void): void;
    static shutdown(reason: string, exitCode: number): Promise<void>;
    private static performShutdownTasks;
    static startParentMonitoring(): void;
    static stopParentMonitoring(): void;
    private static signalHandlersInstalled;
    static setupSignalHandlers(): void;
}
export {};
