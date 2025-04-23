import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class WebhookModel1592447867632 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
