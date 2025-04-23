import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddManagedColumnToCredentialsTable1734479635324 implements ReversibleMigration {
    up({ escape, runQuery, isSqlite }: MigrationContext): Promise<void>;
    down({ escape, runQuery }: MigrationContext): Promise<void>;
}
