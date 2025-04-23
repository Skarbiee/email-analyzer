import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddWorkflowVersionIdColumn1669739707124 implements ReversibleMigration {
    up({ escape, runQuery }: MigrationContext): Promise<void>;
    down({ escape, runQuery }: MigrationContext): Promise<void>;
}
