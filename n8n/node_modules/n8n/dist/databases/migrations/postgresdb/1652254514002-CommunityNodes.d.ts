import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CommunityNodes1652254514002 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
