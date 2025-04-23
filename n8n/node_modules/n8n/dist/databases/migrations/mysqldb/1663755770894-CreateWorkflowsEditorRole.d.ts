import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateWorkflowsEditorRole1663755770894 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
