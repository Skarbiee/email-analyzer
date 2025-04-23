import type { EntityManager } from '@n8n/typeorm';
import { DataSource as Connection } from '@n8n/typeorm';
export declare const getConnection: () => Connection;
type ConnectionState = {
    connected: boolean;
    migrated: boolean;
};
export declare const connectionState: ConnectionState;
export declare function transaction<T>(fn: (entityManager: EntityManager) => Promise<T>): Promise<T>;
export declare function init(): Promise<void>;
export declare function migrate(): Promise<void>;
export declare const close: () => Promise<void>;
export {};
