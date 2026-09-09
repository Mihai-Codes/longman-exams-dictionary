import { MessagePortMain } from "./message-channel-main.js";
import { type RendererMessagePortDescriptor } from "../ipc/message-port-transfer-protocol.js";
declare class MessagePortTransferRegistry {
    private entries;
    private nextPortId;
    transferToRenderer(ports: MessagePortMain[], sendToRenderer: (channel: string, payload: unknown) => void): RendererMessagePortDescriptor[];
    transferFromRenderer(ports: RendererMessagePortDescriptor[], sendToRenderer: (channel: string, payload: unknown) => void): MessagePortMain[];
    postFromRenderer(portId: string, data: unknown, ports?: RendererMessagePortDescriptor[]): boolean;
    closeFromRenderer(portId: string): boolean;
    private handleMainPortClose;
    private registerBridgePort;
    private unregister;
}
export declare const messagePortTransferRegistry: MessagePortTransferRegistry;
export {};
