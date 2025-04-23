declare class LogWriterConfig {
    keepLogCount: number;
    maxFileSizeInKB: number;
    logBaseName: string;
}
export declare class EventBusConfig {
    checkUnsentInterval: number;
    logWriter: LogWriterConfig;
    crashRecoveryMode: 'simple' | 'extensive';
}
export {};
