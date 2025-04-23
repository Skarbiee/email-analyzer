import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class CreateExecutionMetadataTable1679416281778 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
