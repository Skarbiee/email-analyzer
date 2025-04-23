import type { Scope } from '@n8n/permissions';
import type express from 'express';
import type { BooleanLicenseFeature } from '../../../../interfaces';
import type { AuthenticatedRequest } from '../../../../requests';
import type { PaginatedRequest } from '../../../types';
export type ProjectScopeResource = 'workflow' | 'credential';
export declare const globalScope: (scopes: Scope | Scope[]) => (req: AuthenticatedRequest<{
    id?: string;
}>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>;
export declare const projectScope: (scopes: Scope | Scope[], resource: ProjectScopeResource) => (req: AuthenticatedRequest<{
    id?: string;
}>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>;
export declare const validCursor: (req: PaginatedRequest, res: express.Response, next: express.NextFunction) => express.Response | void;
export declare const validLicenseWithUserQuota: (_: express.Request, res: express.Response, next: express.NextFunction) => express.Response | void;
export declare const isLicensed: (feature: BooleanLicenseFeature) => (_: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => Promise<void | express.Response<any, Record<string, any>>>;
