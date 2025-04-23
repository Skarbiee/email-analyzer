import { WithTimestamps } from './abstract-entity';
import { User } from './user';
export type AuthProviderType = 'ldap' | 'email' | 'saml';
export declare class AuthIdentity extends WithTimestamps {
    userId: string;
    user: User;
    providerId: string;
    providerType: AuthProviderType;
    static create(user: User, providerId: string, providerType?: AuthProviderType): AuthIdentity;
}
