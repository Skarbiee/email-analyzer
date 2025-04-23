import type { FindManyOptions, FindOneOptions, FindOptionsWhere } from '@n8n/typeorm';
import type { QueryDeepPartialEntity } from '@n8n/typeorm/query-builder/QueryPartialEntity';
import RudderStack, { type constructorOptions } from '@rudderstack/rudder-sdk-node';
import type { NextFunction, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import type { AuthUser } from '../databases/entities/auth-user';
import type { CredentialsEntity } from '../databases/entities/credentials-entity';
import type { Settings } from '../databases/entities/settings';
import type { User } from '../databases/entities/user';
import type { WorkflowEntity } from '../databases/entities/workflow-entity';
import { AuthUserRepository } from '../databases/repositories/auth-user.repository';
import { CredentialsRepository } from '../databases/repositories/credentials.repository';
import { SettingsRepository } from '../databases/repositories/settings.repository';
import { UserRepository } from '../databases/repositories/user.repository';
import { WorkflowRepository } from '../databases/repositories/workflow.repository';
import type { Invitation } from '../interfaces';
import type { AuthenticatedRequest } from '../requests';
import { UserService } from '../services/user.service';
export declare class HooksService {
    private readonly userService;
    private readonly authService;
    private readonly userRepository;
    private readonly settingsRepository;
    private readonly workflowRepository;
    private readonly credentialsRepository;
    private readonly authUserRepository;
    constructor(userService: UserService, authService: AuthService, userRepository: UserRepository, settingsRepository: SettingsRepository, workflowRepository: WorkflowRepository, credentialsRepository: CredentialsRepository, authUserRepository: AuthUserRepository);
    inviteUsers(owner: User, attributes: Invitation[]): Promise<{
        usersInvited: import("../requests").UserRequest.InviteResponse[];
        usersCreated: string[];
    }>;
    issueCookie(res: Response, user: AuthUser): void;
    findOneUser(filter: FindOneOptions<AuthUser>): Promise<AuthUser | null>;
    saveUser(user: User): Promise<User>;
    updateSettings(filter: FindOptionsWhere<Settings>, set: QueryDeepPartialEntity<Settings>): Promise<import("@n8n/typeorm").UpdateResult>;
    workflowsCount(filter: FindManyOptions<WorkflowEntity>): Promise<number>;
    credentialsCount(filter: FindManyOptions<CredentialsEntity>): Promise<number>;
    settingsCount(filter: FindManyOptions<Settings>): Promise<number>;
    authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getRudderStackClient(key: string, options: constructorOptions): RudderStack;
    dbCollections(): {
        User: UserRepository;
        Settings: SettingsRepository;
        Credentials: CredentialsRepository;
        Workflow: WorkflowRepository;
    };
}
