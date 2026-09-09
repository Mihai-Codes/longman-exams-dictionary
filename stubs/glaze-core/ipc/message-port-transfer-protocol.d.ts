export declare const IPC_TRANSFER_PAYLOAD_MARKER = "__glazeIpcTransferPayloadV1";
export declare const IPC_MESSAGE_PORT_CHANNEL = "__glaze:message-port";
export type RendererMessagePortDescriptor = {
    id: string;
};
export type IpcTransferPayload = {
    [IPC_TRANSFER_PAYLOAD_MARKER]: true;
    args: unknown[];
    ports: RendererMessagePortDescriptor[];
};
export type RendererMessagePortControlMessage = {
    type: "message";
    portId: string;
    data: unknown;
    ports?: RendererMessagePortDescriptor[];
} | {
    type: "close";
    portId: string;
};
export declare function createIpcTransferPayload(args: unknown[], ports: RendererMessagePortDescriptor[]): IpcTransferPayload;
export declare function isIpcTransferPayload(value: unknown): value is IpcTransferPayload;
export declare function isRendererMessagePortDescriptor(value: unknown): value is RendererMessagePortDescriptor;
