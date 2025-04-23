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
var SalesforceJwtApi_credentials_exports = {};
__export(SalesforceJwtApi_credentials_exports, {
  SalesforceJwtApi: () => SalesforceJwtApi
});
module.exports = __toCommonJS(SalesforceJwtApi_credentials_exports);
class SalesforceJwtApi {
  constructor() {
    this.name = "salesforceJwtApi";
    this.displayName = "Salesforce JWT API";
    this.documentationUrl = "salesforce";
    this.properties = [
      {
        displayName: "Environment Type",
        name: "environment",
        type: "options",
        options: [
          {
            name: "Production",
            value: "production"
          },
          {
            name: "Sandbox",
            value: "sandbox"
          }
        ],
        default: "production"
      },
      {
        displayName: "Client ID",
        name: "clientId",
        type: "string",
        default: "",
        required: true,
        description: "Consumer Key from Salesforce Connected App"
      },
      {
        displayName: "Username",
        name: "username",
        type: "string",
        default: "",
        required: true
      },
      {
        displayName: "Private Key",
        name: "privateKey",
        type: "string",
        typeOptions: {
          password: true
        },
        default: "",
        required: true,
        description: "Use the multiline editor. Make sure it is in standard PEM key format:<br />-----BEGIN PRIVATE KEY-----<br />KEY DATA GOES HERE<br />-----END PRIVATE KEY-----"
      }
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SalesforceJwtApi
});
//# sourceMappingURL=SalesforceJwtApi.credentials.js.map