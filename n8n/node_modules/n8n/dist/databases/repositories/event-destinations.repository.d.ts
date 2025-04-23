import { DataSource, Repository } from '@n8n/typeorm';
import { EventDestinations } from '../entities/event-destinations';
export declare class EventDestinationsRepository extends Repository<EventDestinations> {
    constructor(dataSource: DataSource);
}
