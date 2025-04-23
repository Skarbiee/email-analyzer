import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class SeparateExecutionData1690000000010 implements ReversibleMigration {
    up(context: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
