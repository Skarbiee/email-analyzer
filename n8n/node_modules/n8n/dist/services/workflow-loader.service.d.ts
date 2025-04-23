import { type IWorkflowBase, type IWorkflowLoader } from 'n8n-workflow';
import { WorkflowRepository } from '../databases/repositories/workflow.repository';
export declare class WorkflowLoaderService implements IWorkflowLoader {
    private readonly workflowRepository;
    constructor(workflowRepository: WorkflowRepository);
    get(workflowId: string): Promise<IWorkflowBase>;
}
