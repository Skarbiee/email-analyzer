import { LicenseMetricsRepository } from '../databases/repositories/license-metrics.repository';
import { WorkflowRepository } from '../databases/repositories/workflow.repository';
export declare class LicenseMetricsService {
    private readonly licenseMetricsRepository;
    private readonly workflowRepository;
    constructor(licenseMetricsRepository: LicenseMetricsRepository, workflowRepository: WorkflowRepository);
    collectUsageMetrics(): Promise<{
        name: string;
        value: number;
    }[]>;
    collectPassthroughData(): Promise<{
        activeWorkflowIds: string[];
    }>;
}
