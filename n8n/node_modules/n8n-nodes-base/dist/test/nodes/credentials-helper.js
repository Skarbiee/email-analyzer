"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var credentials_helper_exports = {};
__export(credentials_helper_exports, {
  CredentialsHelper: () => CredentialsHelper
});
module.exports = __toCommonJS(credentials_helper_exports);
var import_di = require("@n8n/di");
var import_n8n_core = require("n8n-core");
var import_n8n_workflow = require("n8n-workflow");
var import_credential_types = require("./credential-types");
var import_FakeCredentialsMap = require("./FakeCredentialsMap");
let CredentialsHelper = class extends import_n8n_workflow.ICredentialsHelper {
  getCredentialsProperties() {
    return [];
  }
  async authenticate(credentials, typeName, requestParams) {
    const credentialType = import_di.Container.get(import_credential_types.CredentialTypes).getByName(typeName);
    if (typeof credentialType.authenticate === "function") {
      return await credentialType.authenticate(credentials, requestParams);
    }
    return requestParams;
  }
  async preAuthentication(_helpers, _credentials, _typeName, _node, _credentialsExpired) {
    return void 0;
  }
  getParentTypes(_name) {
    return [];
  }
  async getDecrypted(_additionalData, nodeCredentials, type) {
    return this.getFakeDecryptedCredentials(nodeCredentials, type);
  }
  async getCredentials(_nodeCredentials, _type) {
    return new import_n8n_core.Credentials({ id: null, name: "" }, "", "");
  }
  async updateCredentials(_nodeCredentials, _type, _data) {
  }
  getFakeDecryptedCredentials(nodeCredentials, type) {
    const credentialsMap = import_FakeCredentialsMap.FAKE_CREDENTIALS_DATA;
    if (nodeCredentials && credentialsMap[JSON.stringify(nodeCredentials)]) {
      return credentialsMap[JSON.stringify(nodeCredentials)];
    }
    if (type && credentialsMap[type]) {
      return credentialsMap[type];
    }
    return {};
  }
};
CredentialsHelper = __decorateClass([
  (0, import_di.Service)()
], CredentialsHelper);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CredentialsHelper
});
//# sourceMappingURL=credentials-helper.js.map