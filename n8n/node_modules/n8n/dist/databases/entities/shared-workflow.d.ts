import { WithTimestamps } from './abstract-entity';
import { Project } from './project';
import { WorkflowEntity } from './workflow-entity';
export type WorkflowSharingRole = 'workflow:owner' | 'workflow:editor';
export declare class SharedWorkflow extends WithTimestamps {
    role: WorkflowSharingRole;
    workflow: WorkflowEntity;
    workflowId: string;
    project: Project;
    projectId: string;
}
