import type { MigrationContext } from '../../../databases/types';
import type { UpdateParentFolderIdColumn1740445074052 as BaseMigration } from './1740445074052-UpdateParentFolderIdColumn';
export declare class UpdateParentFolderIdColumn1740445074052 implements BaseMigration {
    transaction: false;
    up({ queryRunner, copyTable, schemaBuilder: { createTable, column }, tablePrefix, }: MigrationContext): Promise<void>;
}
