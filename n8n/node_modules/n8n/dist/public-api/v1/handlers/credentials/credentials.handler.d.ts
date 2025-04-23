import type express from 'express';
import type { CredentialsEntity } from '../../../../databases/entities/credentials-entity';
import type { CredentialTypeRequest, CredentialRequest } from '../../../types';
declare const _default: {
    createCredential: (((req: CredentialRequest.Create, res: express.Response, next: express.NextFunction) => express.Response | void) | ((req: CredentialRequest.Create, res: express.Response) => Promise<express.Response<Partial<CredentialsEntity>>>))[];
    transferCredential: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    deleteCredential: ((req: import("../../../../requests").AuthenticatedRequest<{
        id?: string;
    }>, res: express.Response, next: express.NextFunction) => Promise<express.Response | void>)[];
    getCredentialType: ((req: CredentialTypeRequest.Get, res: express.Response) => Promise<express.Response>)[];
};
export = _default;
