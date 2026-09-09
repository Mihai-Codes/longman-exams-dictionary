export declare const connectionQueryKeys: {
    connection: readonly ["connection"];
    environment: readonly ["environment"];
};
export type EnvironmentInfo = {
    type: "dev-server";
    port: number;
    url: string;
} | {
    type: "built";
    url: string;
} | {
    type: "app";
    url: string;
};
export declare function useEnvironment(): import("@tanstack/react-query").UseQueryResult<{
    type: "dev-server";
    port: number;
    url: string;
} | {
    type: "built";
    url: string;
} | {
    type: "app";
    url: string;
} | null, Error>;
export declare function useConnection(): import("@tanstack/react-query").UseQueryResult<{
    connected: boolean;
    backendPort: null;
}, Error>;
