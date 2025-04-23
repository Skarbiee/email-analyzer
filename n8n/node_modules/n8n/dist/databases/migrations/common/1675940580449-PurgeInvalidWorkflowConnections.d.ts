import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class PurgeInvalidWorkflowConnections1675940580449 implements IrreversibleMigration {
    up({ escape, parseJson, runQuery, nodeTypes }: MigrationContext): Promise<void>;
}
