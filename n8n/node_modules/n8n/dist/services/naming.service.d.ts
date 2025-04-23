import { CredentialsRepository } from '../databases/repositories/credentials.repository';
import { WorkflowRepository } from '../databases/repositories/workflow.repository';
export declare class NamingService {
    private readonly workflowRepository;
    private readonly credentialsRepository;
    constructor(workflowRepository: WorkflowRepository, credentialsRepository: CredentialsRepository);
    getUniqueWorkflowName(requestedName: string): Promise<string>;
    getUniqueCredentialName(requestedName: string): Promise<string>;
    private getUniqueName;
}
