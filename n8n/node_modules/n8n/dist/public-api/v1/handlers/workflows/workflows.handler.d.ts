import type express from 'express';
import type { WorkflowRequest } from '../../../types';
declare const _default: {
    createWorkflow: ((req: WorkflowRequest.Create, res: express.Response) => Promise<express.Response>)[];
    transferWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    deleteWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    getWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    getWorkflows: (((req: import("../../../types").PaginatedRequest, res: express.Response, next: express.NextFunction) => express.Response | void) | ((req: WorkflowRequest.GetAll, res: express.Response) => Promise<express.Response>))[];
    updateWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    activateWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    deactivateWorkflow: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    getWorkflowTags: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    updateWorkflowTags: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
};
export = _default;
