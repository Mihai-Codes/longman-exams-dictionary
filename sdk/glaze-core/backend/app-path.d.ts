export declare function getCurrentAppPath(): string;
/**
 * Resolve the app's build output directory. Shares the deployed-app detection with
 * detectAppContext in cli/build/config.ts via src/shared/project-layout.ts, so the two can no
 * longer drift. Works unchanged in dev (cwd = project dir), local deployed apps
 * (cwd = sources, output in sibling runtime/build) and installed store apps
 * (cwd = Contents/Resources/glaze-runtime, output in ./build).
 */
export declare function resolveBuildOutDir(appRoot?: string, env?: NodeJS.ProcessEnv): string;
export declare function getSidecarBinaryPath(name: string, appRoot?: string, env?: NodeJS.ProcessEnv): string;
