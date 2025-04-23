import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddApiKeysTable1724951148974 implements ReversibleMigration {
    transaction: false;
    up({ queryRunner, tablePrefix, runQuery }: MigrationContext): Promise<void>;
    down({ queryRunner, runQuery, tablePrefix, schemaBuilder: { dropTable, createIndex }, escape, }: MigrationContext): Promise<void>;
}
