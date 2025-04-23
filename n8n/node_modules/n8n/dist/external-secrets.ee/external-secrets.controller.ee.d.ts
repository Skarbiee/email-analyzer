import { Response } from 'express';
import { ExternalSecretsRequest } from '../requests';
import { ExternalSecretsService } from './external-secrets.service.ee';
export declare class ExternalSecretsController {
    private readonly secretsService;
    constructor(secretsService: ExternalSecretsService);
    getProviders(): Promise<{
        displayName: string;
        name: string;
        icon: string;
        state: import("../interfaces").SecretsProviderState;
        connected: boolean;
        connectedAt: Date | null;
        data: import("n8n-workflow").IDataObject;
    }[]>;
    getProvider(req: ExternalSecretsRequest.GetProvider): Promise<ExternalSecretsRequest.GetProviderResponse | null>;
    testProviderSettings(req: ExternalSecretsRequest.TestProviderSettings, res: Response): Promise<{
        success: boolean;
        testState: "connected" | "tested" | "error";
        error?: string;
    }>;
    setProviderSettings(req: ExternalSecretsRequest.SetProviderSettings): Promise<{}>;
    setProviderConnected(req: ExternalSecretsRequest.SetProviderConnected): Promise<{}>;
    updateProvider(req: ExternalSecretsRequest.UpdateProvider, res: Response): Promise<{
        updated: boolean;
    }>;
    getSecretNames(): Record<string, string[]>;
}
