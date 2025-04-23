import type { IProcessedDataEntries, IProcessedDataLatest } from '../../interfaces';
import { WithTimestamps } from './abstract-entity';
export declare class ProcessedData extends WithTimestamps {
    context: string;
    workflowId: string;
    value: IProcessedDataEntries | IProcessedDataLatest;
}
