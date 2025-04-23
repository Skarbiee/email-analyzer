import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class ModifyWorkflowHistoryNodesAndConnections1695829275184 implements ReversibleMigration {
    up({ schemaBuilder: { addColumns, dropColumns, column } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropColumns, addColumns, column } }: MigrationContext): Promise<void>;
}
