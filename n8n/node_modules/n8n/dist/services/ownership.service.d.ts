import type { Project } from '../databases/entities/project';
import type { User } from '../databases/entities/user';
import { ProjectRelationRepository } from '../databases/repositories/project-relation.repository';
import { ProjectRepository } from '../databases/repositories/project.repository';
import { SharedWorkflowRepository } from '../databases/repositories/shared-workflow.repository';
import { UserRepository } from '../databases/repositories/user.repository';
import type { ListQuery } from '../requests';
import { CacheService } from '../services/cache/cache.service';
export declare class OwnershipService {
    private cacheService;
    private userRepository;
    private projectRepository;
    private projectRelationRepository;
    private sharedWorkflowRepository;
    constructor(cacheService: CacheService, userRepository: UserRepository, projectRepository: ProjectRepository, projectRelationRepository: ProjectRelationRepository, sharedWorkflowRepository: SharedWorkflowRepository);
    getWorkflowProjectCached(workflowId: string): Promise<Project>;
    getPersonalProjectOwnerCached(projectId: string): Promise<User | null>;
    addOwnedByAndSharedWith(rawWorkflow: ListQuery.Workflow.WithSharing): ListQuery.Workflow.WithOwnedByAndSharedWith;
    addOwnedByAndSharedWith(rawCredential: ListQuery.Credentials.WithSharing): ListQuery.Credentials.WithOwnedByAndSharedWith;
    getInstanceOwner(): Promise<User>;
}
