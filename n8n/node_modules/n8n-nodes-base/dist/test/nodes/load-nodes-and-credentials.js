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
var load_nodes_and_credentials_exports = {};
__export(load_nodes_and_credentials_exports, {
  LoadNodesAndCredentials: () => LoadNodesAndCredentials
});
module.exports = __toCommonJS(load_nodes_and_credentials_exports);
var import_di = require("@n8n/di");
var import_n8n_core = require("n8n-core");
const fixSourcePath = (loadInfo) => {
  if (!loadInfo) return;
  loadInfo.sourcePath = loadInfo.sourcePath.replace(/^dist\//, "./").replace(/\.js$/, ".ts");
};
let LoadNodesAndCredentials = class {
  constructor(baseDir) {
    this.known = { nodes: {}, credentials: {} };
    this.loader = new import_n8n_core.LazyPackageDirectoryLoader(baseDir);
  }
  async init() {
    await this.loader.loadAll();
    this.known.credentials = this.loader.known.credentials;
    this.known.nodes = this.loader.known.nodes;
  }
  recognizesCredential(credentialType) {
    return credentialType in this.known.credentials;
  }
  getCredential(credentialType) {
    fixSourcePath(this.known.credentials[credentialType]);
    return this.loader.getCredential(credentialType);
  }
  getNode(fullNodeType) {
    const nodeType = fullNodeType.split(".")[1];
    fixSourcePath(this.known.nodes[nodeType]);
    return this.loader.getNode(nodeType);
  }
};
LoadNodesAndCredentials = __decorateClass([
  (0, import_di.Service)()
], LoadNodesAndCredentials);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LoadNodesAndCredentials
});
//# sourceMappingURL=load-nodes-and-credentials.js.map