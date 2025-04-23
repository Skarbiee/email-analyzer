import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddWorkflowMetadata1695128658538 implements ReversibleMigration {
    up({ schemaBuilder: { addColumns, column } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropColumns } }: MigrationContext): Promise<void>;
}
