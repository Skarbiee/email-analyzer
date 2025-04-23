import { WorkflowHistoryRepository } from '../../databases/repositories/workflow-history.repository';
export declare class WorkflowHistoryManager {
    private workflowHistoryRepo;
    pruneTimer?: NodeJS.Timeout;
    constructor(workflowHistoryRepo: WorkflowHistoryRepository);
    init(): void;
    shutdown(): void;
    prune(): Promise<void>;
}
