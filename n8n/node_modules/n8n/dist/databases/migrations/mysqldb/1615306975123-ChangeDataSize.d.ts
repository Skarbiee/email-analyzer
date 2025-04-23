import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class ChangeDataSize1615306975123 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
