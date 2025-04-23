import type { User } from '../databases/entities/user';
import { WorkflowStatisticsRepository } from '../databases/repositories/workflow-statistics.repository';
export declare class CtaService {
    private readonly workflowStatisticsRepository;
    constructor(workflowStatisticsRepository: WorkflowStatisticsRepository);
    getBecomeCreatorCta(userId: User['id']): Promise<boolean>;
}
