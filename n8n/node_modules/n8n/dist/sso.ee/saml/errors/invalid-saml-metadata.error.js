"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSamlMetadataError = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class InvalidSamlMetadataError extends n8n_workflow_1.UserError {
    constructor() {
        super('Invalid SAML metadata');
    }
}
exports.InvalidSamlMetadataError = InvalidSamlMetadataError;
//# sourceMappingURL=invalid-saml-metadata.error.js.map