import * as React from "react";
type AttachmentData = {
    id?: string;
    name: string;
    src?: string;
    thumbnailSrc?: string;
    width?: number;
    height?: number;
    kind?: "file" | "image" | "pasted_image";
    mimeType?: string;
};
declare const Root: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface AttachmentItemProps extends React.ComponentProps<"div"> {
    attachment: AttachmentData;
}
declare const Item: React.ForwardRefExoticComponent<Omit<AttachmentItemProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
interface AttachmentPreviewProps extends Omit<React.ComponentProps<"button">, "children"> {
    alt?: string;
}
declare const Preview: React.ForwardRefExoticComponent<Omit<AttachmentPreviewProps, "ref"> & React.RefAttributes<HTMLButtonElement>>;
declare const Info: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> & React.RefAttributes<HTMLSpanElement>>;
declare const Remove: React.ForwardRefExoticComponent<Omit<import("./button").ButtonProps & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<HTMLButtonElement>>;
export { Root, Item, Preview, Info, Remove, type AttachmentData, type AttachmentItemProps, type AttachmentPreviewProps, };
