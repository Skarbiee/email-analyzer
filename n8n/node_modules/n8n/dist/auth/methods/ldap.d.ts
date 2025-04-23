import type { User } from '../../databases/entities/user';
export declare const handleLdapLogin: (loginId: string, password: string) => Promise<User | undefined>;
