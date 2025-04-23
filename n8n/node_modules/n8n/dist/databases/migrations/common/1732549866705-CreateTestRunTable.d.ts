import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateTestRun1732549866705 implements ReversibleMigration {
    up({ schemaBuilder: { createTable, column } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropTable } }: MigrationContext): Promise<void>;
}
