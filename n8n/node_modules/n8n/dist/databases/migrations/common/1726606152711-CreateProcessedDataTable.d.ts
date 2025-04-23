import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateProcessedDataTable1726606152711 implements ReversibleMigration {
    up({ schemaBuilder: { createTable, column } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropTable } }: MigrationContext): Promise<void>;
}
