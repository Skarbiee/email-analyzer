import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class FixTestDefinitionPrimaryKey1739873751194 implements IrreversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
