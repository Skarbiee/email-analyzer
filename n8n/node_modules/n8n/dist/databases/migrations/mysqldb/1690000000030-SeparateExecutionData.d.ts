import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class SeparateExecutionData1690000000030 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
