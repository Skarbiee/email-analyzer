import type { Workflow } from 'n8n-workflow';
import type { User } from '../databases/entities/user';
import { SharedWorkflowRepository } from '../databases/repositories/shared-workflow.repository';
import { UserRepository } from '../databases/repositories/user.repository';
export declare class AccessService {
    private readonly userRepository;
    private readonly sharedWorkflowRepository;
    constructor(userRepository: UserRepository, sharedWorkflowRepository: SharedWorkflowRepository);
    hasReadAccess(userId: User['id'], workflowId: Workflow['id']): Promise<boolean>;
}
