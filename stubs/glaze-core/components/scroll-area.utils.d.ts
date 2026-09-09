export declare const AT_BOTTOM_THRESHOLD_PX = 5;
type ScrollGeometry = {
    scrollHeight: number;
    scrollTop: number;
    clientHeight: number;
};
export declare function shouldShowScrollToBottomButton({ scrollHeight, scrollTop, clientHeight }: ScrollGeometry): boolean;
export {};
