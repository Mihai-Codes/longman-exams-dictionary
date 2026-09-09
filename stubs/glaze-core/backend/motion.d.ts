import { EventEmitter } from "node:events";
export type HeadphoneMotionAuthorizationStatus = "not-determined" | "denied" | "restricted" | "authorized" | "unknown";
export type HeadphoneMotionConnectionState = "connected" | "disconnected" | "unknown";
export interface HeadphoneMotionStatus {
    authorizationStatus: HeadphoneMotionAuthorizationStatus;
    connectionState: HeadphoneMotionConnectionState;
    isAvailable: boolean;
    isActive: boolean;
}
export interface HeadphoneMotionVector {
    x: number;
    y: number;
    z: number;
}
export interface HeadphoneMotionQuaternion {
    x: number;
    y: number;
    z: number;
    w: number;
}
export interface HeadphoneMotionAttitude {
    /** Roll in radians. */
    roll: number;
    /** Pitch in radians. */
    pitch: number;
    /** Yaw in radians. */
    yaw: number;
    quaternion: HeadphoneMotionQuaternion;
}
export interface HeadphoneMotionSample {
    /** Unix time in milliseconds when the host delivered the sample. */
    timestamp: number;
    /** Core Motion's monotonic timestamp in seconds since system startup. */
    sourceTimestamp: number;
    attitude: HeadphoneMotionAttitude;
    rotationRate: HeadphoneMotionVector;
    gravity: HeadphoneMotionVector;
    userAcceleration: HeadphoneMotionVector;
    /** Heading in degrees, or null when Core Motion does not provide one. */
    heading: number | null;
}
export interface HeadphoneMotionStartOptions {
    /** Minimum interval between delivered samples. Defaults to 50 ms. */
    updateIntervalMs?: number;
}
export type HeadphoneMotionErrorCode = "permission-denied" | "motion-unavailable" | "native-error";
export declare class HeadphoneMotionError extends Error {
    readonly code: HeadphoneMotionErrorCode;
    constructor(code: HeadphoneMotionErrorCode, message: string);
}
declare class MotionAPI extends EventEmitter {
    constructor();
    status(): Promise<HeadphoneMotionStatus>;
    start(options?: HeadphoneMotionStartOptions): Promise<HeadphoneMotionStatus>;
    stop(): Promise<void>;
    on(event: "data", listener: (sample: HeadphoneMotionSample) => void): this;
    on(event: "status-changed", listener: (status: HeadphoneMotionStatus) => void): this;
    on(event: "error", listener: (error: HeadphoneMotionError) => void): this;
    once(event: "data", listener: (sample: HeadphoneMotionSample) => void): this;
    once(event: "status-changed", listener: (status: HeadphoneMotionStatus) => void): this;
    once(event: "error", listener: (error: HeadphoneMotionError) => void): this;
    removeListener(event: "data", listener: (sample: HeadphoneMotionSample) => void): this;
    removeListener(event: "status-changed", listener: (status: HeadphoneMotionStatus) => void): this;
    removeListener(event: "error", listener: (error: HeadphoneMotionError) => void): this;
}
export declare const motion: MotionAPI;
export {};
