import type { User } from '../../databases/entities/user';
export declare const handleEmailLogin: (email: string, password: string) => Promise<User | undefined>;
