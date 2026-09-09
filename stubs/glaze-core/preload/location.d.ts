import { type LocationPosition, type LocationPositionErrorCallback, type LocationPositionOptions, type LocationPositionSuccessCallback } from "../ipc/native-api.js";
type LocationInvoke = <T = unknown>(channel: string, ...args: unknown[]) => Promise<T>;
export type GetCurrentPositionCompat = {
    (options?: LocationPositionOptions): Promise<LocationPosition>;
    (success: LocationPositionSuccessCallback, error?: LocationPositionErrorCallback, options?: LocationPositionOptions): void;
};
export declare function createLocationGetCurrentPosition(invoke: LocationInvoke): GetCurrentPositionCompat;
export {};
