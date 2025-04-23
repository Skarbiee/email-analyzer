import { WithTimestampsAndStringId } from './abstract-entity';
import { User } from './user';
export declare class ApiKey extends WithTimestampsAndStringId {
    user: User;
    userId: string;
    label: string;
    apiKey: string;
}
