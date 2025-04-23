import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class MakeStoppedAtNullable1607431743767 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
