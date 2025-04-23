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
var GSuiteAdmin_node_exports = {};
__export(GSuiteAdmin_node_exports, {
  GSuiteAdmin: () => GSuiteAdmin
});
module.exports = __toCommonJS(GSuiteAdmin_node_exports);
var import_n8n_workflow = require("n8n-workflow");
var import_GenericFunctions = require("./GenericFunctions");
var import_GroupDescripion = require("./GroupDescripion");
var import_UserDescription = require("./UserDescription");
class GSuiteAdmin {
  constructor() {
    this.description = {
      displayName: "Google Workspace Admin",
      name: "gSuiteAdmin",
      // eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
      icon: "file:google-workspace-admin.png",
      group: ["input"],
      version: 1,
      subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
      description: "Consume Google Workspace Admin API",
      defaults: {
        name: "Google Workspace Admin"
      },
      usableAsTool: true,
      inputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      outputs: [import_n8n_workflow.NodeConnectionTypes.Main],
      credentials: [
        {
          name: "gSuiteAdminOAuth2Api",
          required: true
        }
      ],
      properties: [
        {
          displayName: "Resource",
          name: "resource",
          type: "options",
          noDataExpression: true,
          options: [
            {
              name: "Group",
              value: "group"
            },
            {
              name: "User",
              value: "user"
            }
          ],
          default: "user"
        },
        ...import_GroupDescripion.groupOperations,
        ...import_GroupDescripion.groupFields,
        ...import_UserDescription.userOperations,
        ...import_UserDescription.userFields
      ]
    };
    this.methods = {
      loadOptions: {
        // Get all the domains to display them to user so that they can
        // select them easily
        async getDomains() {
          const returnData = [];
          const domains = await import_GenericFunctions.googleApiRequestAllItems.call(
            this,
            "domains",
            "GET",
            "/directory/v1/customer/my_customer/domains"
          );
          for (const domain of domains) {
            const domainName = domain.domainName;
            const domainId = domain.domainName;
            returnData.push({
              name: domainName,
              value: domainId
            });
          }
          return returnData;
        },
        // Get all the schemas to display them to user so that they can
        // select them easily
        async getSchemas() {
          const returnData = [];
          const schemas = await import_GenericFunctions.googleApiRequestAllItems.call(
            this,
            "schemas",
            "GET",
            "/directory/v1/customer/my_customer/schemas"
          );
          for (const schema of schemas) {
            const schemaName = schema.displayName;
            const schemaId = schema.schemaName;
            returnData.push({
              name: schemaName,
              value: schemaId
            });
          }
          return returnData;
        }
      }
    };
  }
  async execute() {
    const items = this.getInputData();
    const returnData = [];
    const length = items.length;
    const qs = {};
    let responseData;
    const resource = this.getNodeParameter("resource", 0);
    const operation = this.getNodeParameter("operation", 0);
    for (let i = 0; i < length; i++) {
      try {
        if (resource === "group") {
          if (operation === "create") {
            const email = this.getNodeParameter("email", i);
            const additionalFields = this.getNodeParameter("additionalFields", i);
            const body = {
              email
            };
            Object.assign(body, additionalFields);
            responseData = await import_GenericFunctions.googleApiRequest.call(this, "POST", "/directory/v1/groups", body);
          }
          if (operation === "delete") {
            const groupId = this.getNodeParameter("groupId", i);
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "DELETE",
              `/directory/v1/groups/${groupId}`,
              {}
            );
            responseData = { success: true };
          }
          if (operation === "get") {
            const groupId = this.getNodeParameter("groupId", i);
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "GET",
              `/directory/v1/groups/${groupId}`,
              {}
            );
          }
          if (operation === "getAll") {
            const returnAll = this.getNodeParameter("returnAll", i);
            const options = this.getNodeParameter("options", i);
            Object.assign(qs, options);
            if (qs.customer === void 0) {
              qs.customer = "my_customer";
            }
            if (returnAll) {
              responseData = await import_GenericFunctions.googleApiRequestAllItems.call(
                this,
                "groups",
                "GET",
                "/directory/v1/groups",
                {},
                qs
              );
            } else {
              qs.maxResults = this.getNodeParameter("limit", i);
              responseData = await import_GenericFunctions.googleApiRequest.call(
                this,
                "GET",
                "/directory/v1/groups",
                {},
                qs
              );
              responseData = responseData.groups;
            }
          }
          if (operation === "update") {
            const groupId = this.getNodeParameter("groupId", i);
            const updateFields = this.getNodeParameter("updateFields", i);
            const body = {};
            Object.assign(body, updateFields);
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "PUT",
              `/directory/v1/groups/${groupId}`,
              body
            );
          }
        }
        if (resource === "user") {
          if (operation === "create") {
            const domain = this.getNodeParameter("domain", i);
            const firstName = this.getNodeParameter("firstName", i);
            const lastName = this.getNodeParameter("lastName", i);
            const password = this.getNodeParameter("password", i);
            const username = this.getNodeParameter("username", i);
            const makeAdmin = this.getNodeParameter("makeAdmin", i);
            const additionalFields = this.getNodeParameter("additionalFields", i);
            const body = {
              name: {
                familyName: lastName,
                givenName: firstName
              },
              password,
              primaryEmail: `${username}@${domain}`
            };
            Object.assign(body, additionalFields);
            if (additionalFields.phoneUi) {
              const phones = additionalFields.phoneUi.phoneValues;
              body.phones = phones;
              delete body.phoneUi;
            }
            if (additionalFields.emailUi) {
              const emails = additionalFields.emailUi.emailValues;
              body.emails = emails;
              delete body.emailUi;
            }
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "POST",
              "/directory/v1/users",
              body,
              qs
            );
            if (makeAdmin) {
              await import_GenericFunctions.googleApiRequest.call(
                this,
                "POST",
                `/directory/v1/users/${responseData.id}/makeAdmin`,
                { status: true }
              );
              responseData.isAdmin = true;
            }
          }
          if (operation === "delete") {
            const userId = this.getNodeParameter("userId", i);
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "DELETE",
              `/directory/v1/users/${userId}`,
              {}
            );
            responseData = { success: true };
          }
          if (operation === "get") {
            const userId = this.getNodeParameter("userId", i);
            const projection = this.getNodeParameter("projection", i);
            const options = this.getNodeParameter("options", i);
            qs.projection = projection;
            Object.assign(qs, options);
            if (qs.customFieldMask) {
              qs.customFieldMask = qs.customFieldMask.join(" ");
            }
            if (qs.projection === "custom" && qs.customFieldMask === void 0) {
              throw new import_n8n_workflow.NodeOperationError(
                this.getNode(),
                "When projection is set to custom, the custom schemas field must be defined",
                { itemIndex: i }
              );
            }
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "GET",
              `/directory/v1/users/${userId}`,
              {},
              qs
            );
          }
          if (operation === "getAll") {
            const returnAll = this.getNodeParameter("returnAll", i);
            const projection = this.getNodeParameter("projection", i);
            const options = this.getNodeParameter("options", i);
            qs.projection = projection;
            Object.assign(qs, options);
            if (qs.customer === void 0) {
              qs.customer = "my_customer";
            }
            if (qs.customFieldMask) {
              qs.customFieldMask = qs.customFieldMask.join(" ");
            }
            if (qs.projection === "custom" && qs.customFieldMask === void 0) {
              throw new import_n8n_workflow.NodeOperationError(
                this.getNode(),
                "When projection is set to custom, the custom schemas field must be defined",
                { itemIndex: i }
              );
            }
            if (returnAll) {
              responseData = await import_GenericFunctions.googleApiRequestAllItems.call(
                this,
                "users",
                "GET",
                "/directory/v1/users",
                {},
                qs
              );
            } else {
              qs.maxResults = this.getNodeParameter("limit", i);
              responseData = await import_GenericFunctions.googleApiRequest.call(
                this,
                "GET",
                "/directory/v1/users",
                {},
                qs
              );
              responseData = responseData.users;
            }
          }
          if (operation === "update") {
            const userId = this.getNodeParameter("userId", i);
            const updateFields = this.getNodeParameter("updateFields", i);
            const body = { name: {} };
            Object.assign(body, updateFields);
            if (updateFields.firstName) {
              body.name.givenName = updateFields.firstName;
              delete body.firstName;
            }
            if (updateFields.lastName) {
              body.name.familyName = updateFields.lastName;
              delete body.lastName;
            }
            if (Object.keys(body.name).length === 0) {
              delete body.name;
            }
            if (updateFields.phoneUi) {
              const phones = updateFields.phoneUi.phoneValues;
              body.phones = phones;
              delete body.phoneUi;
            }
            if (updateFields.emailUi) {
              const emails = updateFields.emailUi.emailValues;
              body.emails = emails;
              delete body.emailUi;
            }
            responseData = await import_GenericFunctions.googleApiRequest.call(
              this,
              "PUT",
              `/directory/v1/users/${userId}`,
              body,
              qs
            );
          }
        }
        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } }
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            this.helpers.returnJsonArray({ error: error.message }),
            { itemData: { item: i } }
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }
    return [returnData];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GSuiteAdmin
});
//# sourceMappingURL=GSuiteAdmin.node.js.map