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
var credential_types_exports = {};
__export(credential_types_exports, {
  CredentialTypes: () => CredentialTypes
});
module.exports = __toCommonJS(credential_types_exports);
var import_di = require("@n8n/di");
let CredentialTypes = class {
  constructor(loadNodesAndCredentials) {
    this.loadNodesAndCredentials = loadNodesAndCredentials;
  }
  recognizes(type) {
    return this.loadNodesAndCredentials.recognizesCredential(type);
  }
  getByName(type) {
    return this.loadNodesAndCredentials.getCredential(type).type;
  }
  getSupportedNodes(type) {
    return this.loadNodesAndCredentials.known.credentials[type]?.supportedNodes ?? [];
  }
  getParentTypes(_type) {
    return [];
  }
};
CredentialTypes = __decorateClass([
  (0, import_di.Service)()
], CredentialTypes);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CredentialTypes
});
//# sourceMappingURL=credential-types.js.map