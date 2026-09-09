import * as React from "react";
import { type ToasterProps } from "sonner";
type ToastType = "success" | "error" | "warning" | "info" | "loading";
interface ToastAction {
    label: string;
    onClick?: () => void;
}
interface ToastProps {
    id: string | number;
    type: ToastType;
    title: React.ReactNode;
    description?: React.ReactNode;
    actions?: ToastAction[];
}
declare function Toast({ id, type, title, description, actions }: ToastProps): import("react/jsx-runtime").JSX.Element;
declare const Toaster: (props: ToasterProps) => import("react/jsx-runtime").JSX.Element;
declare function PromiseToast({ id, initialMessage }: {
    id: string | number;
    initialMessage: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { Toast, Toaster, PromiseToast };
export type { ToastProps, ToastType, ToastAction };
