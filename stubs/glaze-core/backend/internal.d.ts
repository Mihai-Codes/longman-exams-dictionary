/**
 * Temporary internal entrypoint for main-app migration.
 *
 * Re-exports framework internals that are being removed from the public
 * barrel (`@glaze/core/backend`). Main-app imports these during the
 * transition period so the public barrel can shrink to only the
 * consumer-facing API.
 *
 * This module will be removed in Phase B once main-app no longer
 * references these symbols directly.
 *
 * @internal
 */
export { GlazeIPCServer } from "./ipc.js";
export type { GlazeIPCTransport, IPCAuthorizationContext, IPCAuthorizationDecision, IPCHandler, IPCHandlerAuthorization, IPCHandlerExecutionOptions, IPCHandlerKind, IPCMessage, IPCResponse, IPCStreamRequestContext, StreamingIPCHandler, } from "./types.js";
export { GlazeLifecycle, childProcessTracker } from "./lifecycle.js";
export type { LifecycleCallbacks } from "./lifecycle.js";
export { backendNativeBridge } from "./backend-native-bridge.js";
export { isSafeStoragePermanentDecryptionError } from "./safe-storage-errors.js";
export { getSidecarBinaryPath } from "./app-path.js";
export { invokeSwiftFunction, SwiftError } from "./swift-sidecar.js";
export { registerNativeApiHandlers } from "./native-api-handlers.js";
export type { RegisterNativeApiHandlersOptions, NativeApiPermissionContext } from "./native-api-handlers.js";
export { wireProtocolHandlers } from "./protocol.js";
export { wireSessionHandlers } from "./session.js";
