declare const TRANSPORT_ENVELOPE_KEY = "__glazeIPCStructuredCloneV1";
/**
 * Reserved IPC method the renderer invokes right after connecting to learn the
 * host's transport capabilities. Hosts that predate this handshake reject it as an
 * unknown method, which the renderer reads as "this host can't decode the envelope"
 * and falls back to raw params — keeping newer-built apps compatible with older hosts.
 */
export declare const TRANSPORT_HELLO_METHOD = "glaze.transport.hello";
/**
 * Transport capabilities a host built with this SDK advertises in response to the
 * {@link TRANSPORT_HELLO_METHOD} handshake (host → renderer).
 */
export declare const HOST_TRANSPORT_CAPABILITIES: {
    readonly structuredCloneV1: true;
};
type EncodedIPCValue = {
    type: "Undefined";
} | {
    type: "Null";
} | {
    type: "Boolean";
    value: boolean;
} | {
    type: "String";
    value: string;
} | {
    type: "Number";
    value: string;
} | {
    type: "BigInt";
    value: string;
} | {
    type: "Reference";
    id: number;
} | {
    type: "Array";
    id?: number;
    value: EncodedIPCValue[];
} | {
    type: "ArrayHole";
} | {
    type: "Object";
    id?: number;
    value: Array<[string, EncodedIPCValue]>;
} | {
    type: "Date";
    id?: number;
    value: string;
} | {
    type: "RegExp";
    id?: number;
    source: string;
    flags: string;
    lastIndex: string;
} | {
    type: "Map";
    id?: number;
    value: Array<[EncodedIPCValue, EncodedIPCValue]>;
} | {
    type: "Set";
    id?: number;
    value: EncodedIPCValue[];
} | {
    type: "ArrayBuffer";
    id?: number;
    value: string;
} | {
    type: "TypedArray";
    id?: number;
    name: TypedArrayName;
    value: string;
} | {
    type: "DataView";
    id?: number;
    value: string;
} | {
    type: "Error";
    id?: number;
    name: string;
    message: string;
    stack?: string;
};
type IPCTransportEnvelope = {
    [TRANSPORT_ENVELOPE_KEY]: EncodedIPCValue;
};
type TypedArrayName = "Int8Array" | "Uint8Array" | "Uint8ClampedArray" | "Int16Array" | "Uint16Array" | "Int32Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array";
export declare function createCloneError(path: string, value?: unknown): Error;
/**
 * Whether `value` must travel inside the structured-clone envelope to survive IPC,
 * or can be sent as raw JSON.
 *
 * Plain JSON-safe values — trees of `null`, finite non-`-0` numbers, strings,
 * booleans, plain objects, and dense arrays, each object reachable only once — round
 * trip losslessly as raw JSON, so the transport sends them unwrapped. That keeps the
 * common path cheap and, crucially, readable by any host regardless of which SDK
 * version it bundles.
 *
 * Everything JSON would drop, mangle, or duplicate needs the envelope: `undefined`,
 * `bigint`, `NaN`/`Infinity`/`-0`, `Date`, `Map`/`Set`, `RegExp`, `Error`,
 * `ArrayBuffer` and views, non-plain/class instances, sparse arrays, and any repeated
 * or cyclic reference (the envelope preserves shared identity; raw JSON would clone
 * it, or throw on a cycle). Functions, symbols, and Promises also return `true` so
 * they reach the encoder, which throws an actionable error rather than letting JSON
 * silently drop them.
 *
 * A value that already looks like the envelope (a lone `__glazeIPCStructuredCloneV1`
 * key) also returns `true`: sent raw it would be mistaken for an envelope by the
 * receiver and decoded, so it must be wrapped (double-wrapping round-trips correctly).
 */
export declare function requiresIPCTransportEnvelope(value: unknown): boolean;
export declare function serializeIPCTransportValue(value: unknown, path?: string): IPCTransportEnvelope;
export declare function deserializeIPCTransportValue(value: unknown): unknown;
export declare function assertIPCSerializableValue(value: unknown, path?: string): void;
export declare function assertIPCSerializableArguments(args: unknown[]): void;
export {};
