import { DataSource, Repository } from '@n8n/typeorm';
import { WorkflowHistory } from '../entities/workflow-history';
export declare class WorkflowHistoryRepository extends Repository<WorkflowHistory> {
    constructor(dataSource: DataSource);
    deleteEarlierThan(date: Date): Promise<import("@n8n/typeorm").DeleteResult>;
}
