import type { IrreversibleMigration, MigrationContext } from '../../../databases/types';
export declare class MigrateToTimestampTz1694091729095 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
