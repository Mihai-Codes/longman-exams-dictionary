export declare function useWindowFocusState(): boolean;
export declare function useOnWindowFocusStateChange({ onLoss, onGain }: {
    onLoss?: () => void;
    onGain?: () => void;
}): void;
