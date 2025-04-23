import { InstanceSettings } from 'n8n-core';
import { ActiveWorkflowManager } from '../active-workflow-manager';
import { WorkflowRepository } from '../databases/repositories/workflow.repository';
import { OrchestrationService } from '../services/orchestration.service';
export declare class DebugController {
    private readonly orchestrationService;
    private readonly activeWorkflowManager;
    private readonly workflowRepository;
    private readonly instanceSettings;
    constructor(orchestrationService: OrchestrationService, activeWorkflowManager: ActiveWorkflowManager, workflowRepository: WorkflowRepository, instanceSettings: InstanceSettings);
    getMultiMainSetupDetails(): Promise<{
        instanceId: string;
        leaderKey: string | null;
        isLeader: boolean;
        activeWorkflows: {
            webhooks: {
                id: string;
                name: string;
            }[];
            triggersAndPollers: import("../databases/entities/workflow-entity").WorkflowEntity[];
        };
        activationErrors: import("../services/cache/cache.types").Hash<string>;
    }>;
}
