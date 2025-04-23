import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class WebhookModel1592445003908 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
