import type { SecretsProvider } from '../interfaces';
export declare class ExternalSecretsProviders {
    providers: Record<string, {
        new (): SecretsProvider;
    }>;
    getProvider(name: string): {
        new (): SecretsProvider;
    } | null;
    hasProvider(name: string): boolean;
    getAllProviders(): Record<string, new () => SecretsProvider>;
}
