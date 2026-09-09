import { EventEmitter } from "node:events";
export type PowerMonitorIdleState = "active" | "idle" | "locked" | "unknown";
export type PowerMonitorThermalState = "unknown" | "nominal" | "fair" | "serious" | "critical";
export type PowerMonitorNoDetailEventName = "suspend" | "resume" | "on-ac" | "on-battery" | "lock-screen" | "unlock-screen" | "user-did-become-active" | "user-did-resign-active";
export type PowerMonitorEvents = {
    suspend: [event: PowerMonitorEvent];
    resume: [event: PowerMonitorEvent];
    "on-ac": [event: PowerMonitorEvent];
    "on-battery": [event: PowerMonitorEvent];
    "thermal-state-change": [details: {
        state: PowerMonitorThermalState;
    }];
    "speed-limit-change": [details: {
        limit: number;
    }];
    shutdown: [event: PowerMonitorShutdownEvent];
    "lock-screen": [event: PowerMonitorEvent];
    "unlock-screen": [event: PowerMonitorEvent];
    "user-did-become-active": [event: PowerMonitorEvent];
    "user-did-resign-active": [event: PowerMonitorEvent];
};
type CommandRunner = (command: string, args: string[]) => string;
export declare class PowerMonitorEvent extends Event {
    constructor(type: PowerMonitorNoDetailEventName);
}
export declare class PowerMonitorShutdownEvent extends Event {
    constructor();
}
declare class PowerMonitor extends EventEmitter {
    private nativeMonitoringState;
    constructor();
    get onBatteryPower(): boolean;
    getSystemIdleTime(): number;
    getSystemIdleState(idleThreshold: number): PowerMonitorIdleState;
    getCurrentThermalState(): PowerMonitorThermalState;
    isOnBatteryPower(): boolean;
    private _isScreenLocked;
    _handleNativeEvent<K extends keyof PowerMonitorEvents>(eventName: K, ...args: PowerMonitorEvents[K]): void;
    _resetNativeEventMonitoringForTests(): void;
    private hasPowerMonitorListeners;
    private ensureNativeEventMonitoringStartedForEvent;
    private ensureNativeEventMonitoringStarted;
    private _handleNativeNotification;
    on<K extends keyof PowerMonitorEvents>(eventName: K, listener: (...args: PowerMonitorEvents[K]) => void): this;
    once<K extends keyof PowerMonitorEvents>(eventName: K, listener: (...args: PowerMonitorEvents[K]) => void): this;
    off<K extends keyof PowerMonitorEvents>(eventName: K, listener: (...args: PowerMonitorEvents[K]) => void): this;
    addListener<K extends keyof PowerMonitorEvents>(eventName: K, listener: (...args: PowerMonitorEvents[K]) => void): this;
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
    removeListener<K extends keyof PowerMonitorEvents>(eventName: K, listener: (...args: PowerMonitorEvents[K]) => void): this;
}
export declare const powerMonitor: PowerMonitor;
export declare function __setPowerMonitorCommandRunnerForTests(runner: CommandRunner | null): void;
export declare function __resetPowerMonitorNativeMonitoringForTests(): void;
export {};
