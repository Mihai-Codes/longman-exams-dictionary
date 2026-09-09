interface AppVisibilityCacheBridge {
    isHidden(): boolean;
    markShownWithoutActivation(): void;
    restoreHidden(): void;
}
export declare function setAppVisibilityCacheBridge(nextBridge: AppVisibilityCacheBridge): void;
export declare function getAppVisibilityCacheBridge(): AppVisibilityCacheBridge | null;
export {};
