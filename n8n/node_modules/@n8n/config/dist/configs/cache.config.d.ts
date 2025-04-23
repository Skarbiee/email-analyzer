declare class MemoryConfig {
    maxSize: number;
    ttl: number;
}
declare class RedisConfig {
    prefix: string;
    ttl: number;
}
export declare class CacheConfig {
    backend: 'memory' | 'redis' | 'auto';
    memory: MemoryConfig;
    redis: RedisConfig;
}
export {};
