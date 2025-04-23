import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddStatsColumnsToTestRun1736172058779 implements ReversibleMigration {
    up({ escape, runQuery }: MigrationContext): Promise<void>;
    down({ escape, runQuery }: MigrationContext): Promise<void>;
}
