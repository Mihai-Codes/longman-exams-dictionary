import { type ReactNode } from "react";
import { toast as sonnerToast, type ExternalToast } from "sonner";
interface PromiseResult {
    message: ReactNode;
    description?: string;
}
type PromiseStateResult<T = unknown> = ReactNode | PromiseResult | ((data: T) => ReactNode | PromiseResult | Promise<ReactNode | PromiseResult>);
interface PromiseOptions<T> extends Omit<ExternalToast, "description"> {
    loading?: ReactNode;
    success?: PromiseStateResult<T>;
    error?: PromiseStateResult;
    finally?: () => void | Promise<void>;
}
declare function toastPromise<T>(promise: Promise<T> | (() => Promise<T>), options: PromiseOptions<T>): string | number;
declare const toast: ((message: ReactNode, options?: ExternalToast) => string | number) & {
    success: (message: ReactNode, options?: ExternalToast) => string | number;
    error: (message: ReactNode, options?: ExternalToast) => string | number;
    warning: (message: ReactNode, options?: ExternalToast) => string | number;
    info: (message: ReactNode, options?: ExternalToast) => string | number;
    loading: (message: ReactNode, options?: ExternalToast) => string | number;
    promise: typeof toastPromise;
    dismiss: typeof sonnerToast.dismiss;
    custom: typeof sonnerToast.custom;
    message: typeof sonnerToast.message;
};
export { toast };
