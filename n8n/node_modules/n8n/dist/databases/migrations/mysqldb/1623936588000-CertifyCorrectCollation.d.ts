import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class CertifyCorrectCollation1623936588000 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix, dbType, dbName }: MigrationContext): Promise<void>;
}
