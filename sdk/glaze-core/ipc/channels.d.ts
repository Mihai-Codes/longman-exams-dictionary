/**
 * Glaze Framework - IPC Channel Type Definitions
 *
 * Provides type-safe channel definitions for IPC communication.
 * This ensures type safety across the IPC boundary between
 * renderer and main/native processes.
 */
/**
 * Buffer encoding types (matching Node.js BufferEncoding)
 */
type BufferEncoding = "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "latin1" | "binary" | "hex";
/**
 * Channel naming conventions :
 * - app:*     → Application-level operations (Node.js backend)
 * - file:*    → File system operations (Node.js backend)
 * - sys:*     → System/OS operations (Node.js backend)
 * - dialog:*  → Dialog operations (Swift native)
 * - window:*  → Window management (Swift native)
 * - native:*  → Generic native operations (Swift native)
 *
 * Apps can define their own channel prefixes for app-specific functionality.
 */
/**
 * Type-safe channel definitions for IPC communication
 *
 * Each channel definition includes:
 * - args: Tuple of arguments expected by the handler
 * - result: Return type of the handler
 * - streaming?: Optional streaming chunk type for streaming channels
 */
export interface IPCChannels {
    "app:getInfo": {
        args: [];
        result: {
            name: string;
            version: string;
            environment: "development" | "production" | "staging";
        };
    };
    "app:ready": {
        args: [];
        result: void;
    };
    "app:quit": {
        args: [options?: {
            force?: boolean;
        }];
        result: void;
    };
    "file:read": {
        args: [path: string, encoding?: BufferEncoding];
        result: string | Buffer;
    };
    "file:write": {
        args: [path: string, data: string | Buffer, options?: {
            encoding?: BufferEncoding;
        }];
        result: void;
    };
    "file:exists": {
        args: [path: string];
        result: boolean;
    };
    "file:delete": {
        args: [path: string];
        result: void;
    };
    "dialog:open": {
        args: [
            options?: {
                title?: string;
                defaultPath?: string;
                buttonLabel?: string;
                filters?: Array<{
                    name: string;
                    extensions: string[];
                }>;
                properties?: Array<"openFile" | "openDirectory" | "multiSelections">;
            }
        ];
        result: {
            canceled: boolean;
            filePaths: string[];
        };
    };
    "dialog:save": {
        args: [
            options?: {
                title?: string;
                defaultPath?: string;
                buttonLabel?: string;
                filters?: Array<{
                    name: string;
                    extensions: string[];
                }>;
            }
        ];
        result: {
            canceled: boolean;
            filePath?: string;
        };
    };
    "dialog:message": {
        args: [
            options: {
                type?: "none" | "info" | "error" | "question" | "warning";
                buttons?: string[];
                defaultId?: number;
                cancelId?: number;
                title?: string;
                message: string;
                detail?: string;
            }
        ];
        result: {
            response: number;
            checkboxChecked?: boolean;
        };
    };
    "window:minimize": {
        args: [];
        result: void;
    };
    "window:maximize": {
        args: [];
        result: void;
    };
    "window:close": {
        args: [];
        result: void;
    };
    "window:setTitle": {
        args: [title: string];
        result: void;
    };
    "window:getBounds": {
        args: [];
        result: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    "sys:getInfo": {
        args: [];
        result: {
            platform: "darwin" | "win32" | "linux";
            arch: "x64" | "arm64" | "arm" | "ia32";
            version: string;
            hostname: string;
        };
    };
    "sys:openExternal": {
        args: [url: string];
        result: void;
    };
    "sys:getPath": {
        args: [
            name: "home" | "appData" | "userData" | "temp" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos"
        ];
        result: string;
    };
    ping: {
        args: [];
        result: {
            message: string;
            timestamp: number;
            status: string;
        };
    };
    "native:showNotification": {
        args: [
            options: {
                title: string;
                body?: string;
                silent?: boolean;
            }
        ];
        result: void;
    };
}
/**
 * Helper type to extract channel names
 */
export type ChannelName = keyof IPCChannels;
/**
 * Helper type to get args for a specific channel
 */
export type ChannelArgs<T extends ChannelName> = IPCChannels[T]["args"];
/**
 * Helper type to get result for a specific channel
 */
export type ChannelResult<T extends ChannelName> = IPCChannels[T]["result"];
/**
 * Helper type to get streaming chunk type for a specific channel
 */
export type ChannelStreamingChunk<T extends ChannelName> = IPCChannels[T] extends {
    streaming: {
        chunk: infer C;
    };
} ? C : never;
/**
 * Type-safe invoke function signature
 */
export interface TypedInvoke {
    <T extends ChannelName>(channel: T, ...args: ChannelArgs<T>): Promise<ChannelResult<T>>;
}
/**
 * Type-safe handle function signature
 */
export interface TypedHandle {
    <T extends ChannelName>(channel: T, handler: (event: any, ...args: ChannelArgs<T>) => Promise<ChannelResult<T>> | ChannelResult<T>): void;
}
/**
 * Type-safe streaming function signature
 */
export interface TypedStream {
    <T extends ChannelName>(channel: T, args: ChannelArgs<T>[0], onChunk: (chunk: ChannelStreamingChunk<T>) => void): Promise<ChannelResult<T>>;
}
/**
 * Channel routing helpers
 */
export declare const channelRouting: {
    /**
     * Check if a channel should be routed to native (Swift)
     */
    isNativeChannel(channel: string): boolean;
    /**
     * Check if a channel should be routed to backend (Node.js)
     */
    isBackendChannel(channel: string): boolean;
    /**
     * Check if a channel supports streaming
     * Apps can extend this for their own streaming channels
     */
    isStreamingChannel(_channel: string): boolean;
};
/**
 * Default export for convenience
 */
declare const _default: {
    channelRouting: {
        /**
         * Check if a channel should be routed to native (Swift)
         */
        isNativeChannel(channel: string): boolean;
        /**
         * Check if a channel should be routed to backend (Node.js)
         */
        isBackendChannel(channel: string): boolean;
        /**
         * Check if a channel supports streaming
         * Apps can extend this for their own streaming channels
         */
        isStreamingChannel(_channel: string): boolean;
    };
};
export default _default;
