export type PowerSaveBlockerType = "prevent-app-suspension" | "prevent-display-sleep";
declare function start(type: PowerSaveBlockerType): number;
declare function stop(id: number): boolean;
declare function isStarted(id: number): boolean;
export declare const powerSaveBlocker: {
    start: typeof start;
    stop: typeof stop;
    isStarted: typeof isStarted;
};
export {};
