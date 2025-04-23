import { WithTimestamps } from './abstract-entity';
import { CredentialsEntity } from './credentials-entity';
import { Project } from './project';
export type CredentialSharingRole = 'credential:owner' | 'credential:user';
export declare class SharedCredentials extends WithTimestamps {
    role: CredentialSharingRole;
    credentials: CredentialsEntity;
    credentialsId: string;
    project: Project;
    projectId: string;
}
