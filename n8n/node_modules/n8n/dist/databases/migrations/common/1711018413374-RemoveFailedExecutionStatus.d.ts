import type { IrreversibleMigration, MigrationContext } from '../../../databases/types';
export declare class RemoveFailedExecutionStatus1711018413374 implements IrreversibleMigration {
    up({ escape, runQuery }: MigrationContext): Promise<void>;
}
