export type TraceRecordingMode = "record-until-full" | "record-continuously" | "record-as-much-as-possible" | "trace-to-console";
export interface TraceCategoriesAndOptions {
    categoryFilter: string;
    traceOptions: string;
}
export interface TraceConfig {
    recording_mode?: TraceRecordingMode;
    trace_buffer_size_in_kb?: number;
    trace_buffer_size_in_events?: number;
    enable_argument_filter?: boolean;
    included_categories?: string[];
    excluded_categories?: string[];
    included_process_ids?: number[];
    histogram_names?: string[];
    memory_dump_config?: Record<string, unknown>;
}
export interface TraceBufferUsage {
    value: number;
    percentage: number;
}
export type HeapProfilingMode = "all" | "browser" | "gpu" | "minimal" | "renderer-sampling" | "all-renderers" | "utility-sampling" | "all-utilities" | "utility-and-browser";
export type HeapProfilingStackMode = "native" | "native-with-thread-names";
export interface EnableHeapProfilingOptions {
    mode?: HeapProfilingMode;
    samplingRate?: number;
    stackMode?: HeapProfilingStackMode;
}
export type ContentTracingOptions = TraceConfig | TraceCategoriesAndOptions;
export interface ContentTracingLike {
    getCategories(): Promise<string[]>;
    startRecording(options: ContentTracingOptions): Promise<void>;
    stopRecording(resultFilePath?: string): Promise<string>;
    getTraceBufferUsage(): Promise<TraceBufferUsage>;
    enableHeapProfiling(options?: EnableHeapProfilingOptions): Promise<void>;
}
export declare const contentTracing: ContentTracingLike;
