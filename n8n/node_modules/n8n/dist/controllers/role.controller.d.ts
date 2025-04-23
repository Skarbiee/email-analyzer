import { type AllRoleTypes, RoleService } from '../services/role.service';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    getAllRoles(): Promise<{
        [k: string]: {
            name: string;
            role: AllRoleTypes;
            scopes: import("@n8n/permissions").Scope[];
            licensed: boolean;
        }[];
    }>;
}
