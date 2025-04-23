import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddUserSettings1652367743993 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
