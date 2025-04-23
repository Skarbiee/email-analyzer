import type { MigrationContext, ReversibleMigration } from '../../../databases/types';
export declare class IntroducePinData1654089251344 implements ReversibleMigration {
    up({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
    down({ queryRunner, tablePrefix }: MigrationContext): Promise<void>;
}
