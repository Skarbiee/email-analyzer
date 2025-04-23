import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class ChangeCredentialDataSize1620729500000 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
