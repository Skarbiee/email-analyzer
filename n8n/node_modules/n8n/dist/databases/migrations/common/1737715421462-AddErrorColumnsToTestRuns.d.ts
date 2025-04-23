import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddErrorColumnsToTestRuns1737715421462 implements ReversibleMigration {
    up({ escape, runQuery }: MigrationContext): Promise<void>;
    down({ escape, runQuery }: MigrationContext): Promise<void>;
}
