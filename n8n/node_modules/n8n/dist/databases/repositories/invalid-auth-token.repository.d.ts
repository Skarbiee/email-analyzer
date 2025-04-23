import { DataSource, Repository } from '@n8n/typeorm';
import { InvalidAuthToken } from '../entities/invalid-auth-token';
export declare class InvalidAuthTokenRepository extends Repository<InvalidAuthToken> {
    constructor(dataSource: DataSource);
}
