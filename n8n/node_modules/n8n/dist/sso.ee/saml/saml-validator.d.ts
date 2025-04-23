import { Logger } from 'n8n-core';
export declare class SamlValidator {
    private readonly logger;
    private xmlMetadata;
    private xmlProtocol;
    private preload;
    constructor(logger: Logger);
    private xmllint;
    init(): Promise<void>;
    validateMetadata(metadata: string): Promise<boolean>;
    validateResponse(response: string): Promise<boolean>;
    private loadSchemas;
    private validateXml;
}
