import { ExecutionMetadataRepository } from '../databases/repositories/execution-metadata.repository';
export declare class ExecutionMetadataService {
    private readonly executionMetadataRepository;
    constructor(executionMetadataRepository: ExecutionMetadataRepository);
    save(executionId: string, executionMetadata: Record<string, string>): Promise<void>;
}
