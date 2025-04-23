import type { AwsSecretsManagerContext, ConnectionTestResult, Secret } from './types';
export declare class AwsSecretsClient {
    private settings;
    constructor(settings: AwsSecretsManagerContext['settings']);
    checkConnection(): ConnectionTestResult;
    fetchAllSecrets(): Promise<Secret[]>;
    private batch;
    private toRequestOptions;
    private fetchSecretsPage;
    private fetchAllSecretsNames;
    private fetchSecretsNamesPage;
}
