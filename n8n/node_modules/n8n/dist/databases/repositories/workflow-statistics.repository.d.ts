import { GlobalConfig } from '@n8n/config';
import { DataSource, Repository } from '@n8n/typeorm';
import type { User } from '../../databases/entities/user';
import { StatisticsNames, WorkflowStatistics } from '../entities/workflow-statistics';
type StatisticsInsertResult = 'insert' | 'failed' | 'alreadyExists';
type StatisticsUpsertResult = StatisticsInsertResult | 'update';
export declare class WorkflowStatisticsRepository extends Repository<WorkflowStatistics> {
    private readonly globalConfig;
    constructor(dataSource: DataSource, globalConfig: GlobalConfig);
    insertWorkflowStatistics(eventName: StatisticsNames, workflowId: string): Promise<StatisticsInsertResult>;
    upsertWorkflowStatistics(eventName: StatisticsNames, workflowId: string): Promise<StatisticsUpsertResult>;
    queryNumWorkflowsUserHasWithFiveOrMoreProdExecs(userId: User['id']): Promise<number>;
}
export {};
