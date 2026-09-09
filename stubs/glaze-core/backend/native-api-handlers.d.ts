/**
 * Native API IPC Handlers
 *
 * Registers IPC handlers for all native operations using channel names.
 * Handlers use backend modules (dialog, shell, screen, etc.) directly from the backend.
 *
 * Channel naming convention: "module:method" (e.g., "dialog:showOpenDialog")
 * Built-in modules use the `module:method` channel pattern.
 */
import { type PermissionCapability } from "../ipc/native-api.js";
type PermissionMethodName = "systemPreferences:getMediaAccessStatus" | "systemPreferences:askForMediaAccess" | "systemPreferences:requestScreenCaptureAccess" | "systemPreferences:getAuthorizationStatus" | "systemPreferences:isTrustedAccessibilityClient" | "location:getCurrentPosition";
export interface NativeApiPermissionContext {
    method: PermissionMethodName;
    requiredCapability?: PermissionCapability;
}
export interface RegisterNativeApiHandlersOptions {
    permissionGuard?: (context: NativeApiPermissionContext) => Promise<void> | void;
}
export { serializeNativeImageForIPC } from "./native-image-serialization.js";
export declare function registerNativeApiHandlers(options?: RegisterNativeApiHandlersOptions): void;
