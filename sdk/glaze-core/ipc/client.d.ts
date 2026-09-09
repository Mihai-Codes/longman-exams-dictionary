export interface GlazeIPCClient {
    native: {
        showNotification(title: string, message: string): Promise<void>;
    };
    backend: {
        ping(): Promise<{
            message: string;
            timestamp: number;
            status: string;
        }>;
        getInfo(): Promise<{
            name: string;
            version: string;
            environment: string;
        }>;
    };
    connect(): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
}
declare class IPCClient implements GlazeIPCClient {
    private transport;
    private config;
    private activeConnections;
    private connectPromise;
    constructor();
    native: {
        showNotification: (title: string, message: string) => Promise<void>;
    };
    backend: {
        ping: () => Promise<{
            message: string;
            timestamp: number;
            status: string;
        }>;
        getInfo: () => Promise<{
            name: string;
            version: string;
            environment: string;
        }>;
    };
    connect(): Promise<void>;
    disconnect(): void;
    isConnected(): boolean;
    private performConnect;
    private isGlazeApp;
}
export declare const ipcClient: IPCClient;
export {};
