import type { BaseMigration, MigrationContext } from '../../../databases/types';
export declare class UpdateParentFolderIdColumn1740445074052 implements BaseMigration {
    up({ escape, queryRunner }: MigrationContext): Promise<void>;
}
