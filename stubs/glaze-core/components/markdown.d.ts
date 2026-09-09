import * as React from "react";
import { type Components } from "react-markdown";
interface MarkdownProps {
    children: string;
    isStreaming?: boolean;
    syntaxHighlighting?: boolean;
    onCopyCode?: (code: string) => void | Promise<void>;
    components?: Components;
    className?: string;
}
declare const Markdown: React.MemoExoticComponent<({ children, isStreaming, syntaxHighlighting, onCopyCode, components, className }: MarkdownProps) => import("react/jsx-runtime").JSX.Element>;
export { Markdown, type MarkdownProps, type Components as MarkdownComponents };
