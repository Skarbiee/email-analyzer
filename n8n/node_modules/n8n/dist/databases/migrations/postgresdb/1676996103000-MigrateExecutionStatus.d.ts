import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class MigrateExecutionStatus1676996103000 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
