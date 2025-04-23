import type { Response } from 'express';
import type { User } from '../databases/entities/user';
export declare function issueCookie(res: Response, user: User): void;
