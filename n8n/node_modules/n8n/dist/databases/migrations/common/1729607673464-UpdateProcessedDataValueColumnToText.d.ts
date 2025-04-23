import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class UpdateProcessedDataValueColumnToText1729607673464 implements ReversibleMigration {
    up({ schemaBuilder: { addNotNull }, isMysql, runQuery, tablePrefix }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { addNotNull }, isMysql, runQuery, tablePrefix }: MigrationContext): Promise<void>;
}
