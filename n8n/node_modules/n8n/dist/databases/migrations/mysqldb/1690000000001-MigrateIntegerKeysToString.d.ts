import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class MigrateIntegerKeysToString1690000000001 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix, dbType }: MigrationContext): Promise<void>;
}
