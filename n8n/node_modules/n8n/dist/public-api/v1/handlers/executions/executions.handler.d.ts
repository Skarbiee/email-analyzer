import type express from 'express';
import type { ExecutionRequest } from '../../../types';
declare const _default: {
    deleteExecution: ((req: ExecutionRequest.Delete, res: express.Response) => Promise<express.Response>)[];
    getExecution: ((req: ExecutionRequest.Get, res: express.Response) => Promise<express.Response>)[];
    getExecutions: (((req: import("../../../types").PaginatedRequest, res: express.Response, next: express.NextFunction) => express.Response | void) | ((req: ExecutionRequest.GetAll, res: express.Response) => Promise<express.Response>))[];
};
export = _default;
