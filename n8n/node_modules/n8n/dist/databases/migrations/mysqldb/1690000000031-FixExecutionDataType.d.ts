import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class FixExecutionDataType1690000000031 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
