"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORKFLOW_SHARING_EDITOR_SCOPES = exports.WORKFLOW_SHARING_OWNER_SCOPES = exports.CREDENTIALS_SHARING_USER_SCOPES = exports.CREDENTIALS_SHARING_OWNER_SCOPES = void 0;
exports.CREDENTIALS_SHARING_OWNER_SCOPES = [
    'credential:read',
    'credential:update',
    'credential:delete',
    'credential:share',
    'credential:move',
];
exports.CREDENTIALS_SHARING_USER_SCOPES = ['credential:read'];
exports.WORKFLOW_SHARING_OWNER_SCOPES = [
    'workflow:read',
    'workflow:update',
    'workflow:delete',
    'workflow:execute',
    'workflow:share',
    'workflow:move',
];
exports.WORKFLOW_SHARING_EDITOR_SCOPES = [
    'workflow:read',
    'workflow:update',
    'workflow:execute',
];
//# sourceMappingURL=resource-roles.js.map