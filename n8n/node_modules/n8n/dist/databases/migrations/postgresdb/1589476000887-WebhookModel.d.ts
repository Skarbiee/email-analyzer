import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class WebhookModel1589476000887 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
