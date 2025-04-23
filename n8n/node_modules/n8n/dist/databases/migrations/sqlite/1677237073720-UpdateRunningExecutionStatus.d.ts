import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class UpdateRunningExecutionStatus1677237073720 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
