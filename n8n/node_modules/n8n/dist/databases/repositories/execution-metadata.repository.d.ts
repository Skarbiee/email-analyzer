import { DataSource, Repository } from '@n8n/typeorm';
import { ExecutionMetadata } from '../entities/execution-metadata';
export declare class ExecutionMetadataRepository extends Repository<ExecutionMetadata> {
    constructor(dataSource: DataSource);
}
