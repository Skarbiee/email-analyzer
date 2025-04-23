import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class AddWaitColumnId1626183952959 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
