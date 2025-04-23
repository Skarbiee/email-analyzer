import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class MigrateIntegerKeysToString1690000000000 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
