import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateTestMetricTable1732271325258 implements ReversibleMigration {
    up({ schemaBuilder: { createTable, column }, queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { dropTable } }: MigrationContext): Promise<void>;
}
