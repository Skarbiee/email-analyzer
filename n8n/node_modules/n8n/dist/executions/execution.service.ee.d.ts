import { WorkflowRepository } from '../databases/repositories/workflow.repository';
import type { IExecutionResponse, IExecutionFlattedResponse } from '../interfaces';
import { ExecutionService } from './execution.service';
import type { ExecutionRequest } from './execution.types';
import { EnterpriseWorkflowService } from '../workflows/workflow.service.ee';
export declare class EnterpriseExecutionsService {
    private readonly executionService;
    private readonly workflowRepository;
    private readonly enterpriseWorkflowService;
    constructor(executionService: ExecutionService, workflowRepository: WorkflowRepository, enterpriseWorkflowService: EnterpriseWorkflowService);
    findOne(req: ExecutionRequest.GetOne, sharedWorkflowIds: string[]): Promise<IExecutionResponse | IExecutionFlattedResponse | undefined>;
}
