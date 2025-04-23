import { DataSource, Repository } from '@n8n/typeorm';
import { ExecutionAnnotation } from '../../databases/entities/execution-annotation.ee';
export declare class ExecutionAnnotationRepository extends Repository<ExecutionAnnotation> {
    constructor(dataSource: DataSource);
}
