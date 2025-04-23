import { Request, Response, NextFunction } from 'express';
import { WorkflowHistoryRequest } from '../../requests';
import { WorkflowHistoryService } from './workflow-history.service.ee';
export declare class WorkflowHistoryController {
    private readonly historyService;
    constructor(historyService: WorkflowHistoryService);
    workflowHistoryLicense(_req: Request, res: Response, next: NextFunction): void;
    workflowHistoryEnabled(_req: Request, res: Response, next: NextFunction): void;
    getList(req: WorkflowHistoryRequest.GetList): Promise<Omit<import("../../databases/entities/workflow-history").WorkflowHistory, "nodes" | "connections">[]>;
    getVersion(req: WorkflowHistoryRequest.GetVersion): Promise<import("../../databases/entities/workflow-history").WorkflowHistory>;
}
