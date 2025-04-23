import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CommunityNodes1652254514003 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
