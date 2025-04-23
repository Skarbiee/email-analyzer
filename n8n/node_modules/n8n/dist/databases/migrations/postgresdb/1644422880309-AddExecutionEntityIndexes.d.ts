import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddExecutionEntityIndexes1644422880309 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
