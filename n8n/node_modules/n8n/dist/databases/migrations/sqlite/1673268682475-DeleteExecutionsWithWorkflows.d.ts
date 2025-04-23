import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class DeleteExecutionsWithWorkflows1673268682475 implements ReversibleMigration {
    transaction: false;
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
