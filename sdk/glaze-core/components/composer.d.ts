import * as React from "react";
import { type ButtonProps } from "./button";
import { Textarea } from "./textarea";
type ComposerRootProps = React.ComponentProps<"form">;
declare const Root: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "ref"> & React.RefAttributes<HTMLFormElement>>;
type ComposerSurfaceProps = React.ComponentProps<"div">;
declare const Surface: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Row: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Actions: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface ComposerControlProps extends React.ComponentProps<"div"> {
    asChild?: boolean;
}
declare const Control: React.ForwardRefExoticComponent<Omit<ComposerControlProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
type ComposerSubmitMode = "enter" | "command-enter" | "manual";
interface ComposerInputProps extends Omit<React.ComponentProps<typeof Textarea>, "onKeyDown"> {
    submitOn?: ComposerSubmitMode;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}
declare const Input: React.ForwardRefExoticComponent<Omit<ComposerInputProps, "ref"> & React.RefAttributes<HTMLTextAreaElement>>;
interface ComposerSubmitProps extends Omit<ButtonProps, "children"> {
    action?: "send" | "stop";
    children?: React.ReactNode;
}
declare const Submit: React.ForwardRefExoticComponent<ComposerSubmitProps & React.RefAttributes<HTMLButtonElement>>;
declare const Footer: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { Root, Surface, Row, Actions, Control, Input, Submit, Footer, type ComposerRootProps, type ComposerSurfaceProps, type ComposerControlProps, type ComposerInputProps, type ComposerSubmitProps, type ComposerSubmitMode, };
