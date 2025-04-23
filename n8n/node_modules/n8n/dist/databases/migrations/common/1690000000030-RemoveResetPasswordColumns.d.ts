import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class RemoveResetPasswordColumns1690000000030 implements ReversibleMigration {
    up({ schemaBuilder: { dropColumns } }: MigrationContext): Promise<void>;
    down({ schemaBuilder: { addColumns, column } }: MigrationContext): Promise<void>;
}
