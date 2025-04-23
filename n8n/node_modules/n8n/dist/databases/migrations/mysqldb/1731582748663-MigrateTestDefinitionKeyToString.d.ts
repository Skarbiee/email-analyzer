import type { MigrationContext, IrreversibleMigration } from '../../../databases/types';
export declare class MigrateTestDefinitionKeyToString1731582748663 implements IrreversibleMigration {
    up(context: MigrationContext): Promise<void>;
}
