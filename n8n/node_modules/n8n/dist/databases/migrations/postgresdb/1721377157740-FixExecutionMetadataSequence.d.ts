import type { IrreversibleMigration, MigrationContext } from '../../../databases/types';
export declare class FixExecutionMetadataSequence1721377157740 implements IrreversibleMigration {
    up({ queryRunner, escape }: MigrationContext): Promise<void>;
}
