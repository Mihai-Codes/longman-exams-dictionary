import { setup as setupGlobalProxyAgent, type GlobalProxyAgentOptions, type ProxyConfig } from "@raycast/proxy-agent";
type RuntimeNetworkOptions = Partial<GlobalProxyAgentOptions>;
type RuntimeNetworkSetupResult = Awaited<ReturnType<typeof setupGlobalProxyAgent>>;
type ClaudeChildProcessNetworkEnv = Record<string, string>;
declare function formatError(error: unknown): string;
declare function getClaudeChildProcessNetworkEnv(options?: RuntimeNetworkOptions): Promise<ClaudeChildProcessNetworkEnv>;
declare function configureRuntimeNetwork(options?: RuntimeNetworkOptions): Promise<RuntimeNetworkSetupResult>;
export { configureRuntimeNetwork, formatError, getClaudeChildProcessNetworkEnv };
export type { RuntimeNetworkOptions, RuntimeNetworkSetupResult, ClaudeChildProcessNetworkEnv, GlobalProxyAgentOptions, ProxyConfig, };
