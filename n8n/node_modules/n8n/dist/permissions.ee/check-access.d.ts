import type { Scope } from '@n8n/permissions';
import type { User } from '../databases/entities/user';
export declare function userHasScopes(user: User, scopes: Scope[], globalOnly: boolean, { credentialId, workflowId, projectId, }: {
    credentialId?: string;
    workflowId?: string;
    projectId?: string;
}): Promise<boolean>;
