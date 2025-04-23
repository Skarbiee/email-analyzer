import type { Scope, ScopeLevels, GlobalScopes, MaskLevels } from './types.ee';
export declare function combineScopes(userScopes: GlobalScopes, masks?: MaskLevels): Set<Scope>;
export declare function combineScopes(userScopes: ScopeLevels, masks?: MaskLevels): Set<Scope>;
