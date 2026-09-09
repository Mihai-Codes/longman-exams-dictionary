import type React from "react";
type PromiseToastState = {
    type: "success" | "error" | "warning" | "info" | "loading";
    message: React.ReactNode;
    description?: string;
};
declare const promiseToasts: Map<string | number, {
    setState?: (state: PromiseToastState) => void;
    pending?: PromiseToastState;
    disposed?: boolean;
}>;
declare function updatePromiseToast(toastId: string | number, state: PromiseToastState): void;
export { promiseToasts, updatePromiseToast };
export type { PromiseToastState };
