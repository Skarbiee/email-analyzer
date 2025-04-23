import { DataSource, Repository } from '@n8n/typeorm';
import { AuthUser } from '../entities/auth-user';
export declare class AuthUserRepository extends Repository<AuthUser> {
    constructor(dataSource: DataSource);
}
