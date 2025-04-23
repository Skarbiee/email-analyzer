import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateInvalidAuthTokenTable1723627610222 implements ReversibleMigration {
    up({ schemaBuilder: { createTable, column } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropTable } }: MigrationContext): Promise<void>;
}
