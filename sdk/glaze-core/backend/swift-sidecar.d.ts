export declare class SwiftError extends Error {
    stderr: string;
    stdout: string;
    constructor(message: string);
}
export declare function invokeSwiftFunction(executablePath: string, command: string, ...args: unknown[]): Promise<unknown>;
