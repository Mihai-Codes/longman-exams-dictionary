/**
 * location - Glaze native location API
 *
 * Provides location access via native CLLocationManager instead of WebView geolocation.
 */
import { type LocationPosition, type LocationPositionOptions } from "../ipc/native-api.js";
declare function getCurrentPosition(options?: LocationPositionOptions): Promise<LocationPosition>;
export declare const location: {
    getCurrentPosition: typeof getCurrentPosition;
};
export {};
