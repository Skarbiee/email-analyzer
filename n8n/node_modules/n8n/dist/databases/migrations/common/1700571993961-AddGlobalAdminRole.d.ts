import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddGlobalAdminRole1700571993961 implements ReversibleMigration {
    up({ escape, runQuery }: MigrationContext): Promise<void>;
    down({ escape, runQuery }: MigrationContext): Promise<void>;
}
