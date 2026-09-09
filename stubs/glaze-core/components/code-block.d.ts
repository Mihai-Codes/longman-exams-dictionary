import * as React from "react";
interface InlineCodeProps extends React.ComponentProps<"code"> {
}
declare const InlineCode: React.ForwardRefExoticComponent<Omit<InlineCodeProps, "ref"> & React.RefAttributes<HTMLElement>>;
interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLPreElement>, "onCopy"> {
    onCopy?: (code: string) => void | Promise<void>;
}
declare const CodeBlock: React.ForwardRefExoticComponent<CodeBlockProps & React.RefAttributes<HTMLPreElement>>;
export { CodeBlock, InlineCode, type CodeBlockProps, type InlineCodeProps };
