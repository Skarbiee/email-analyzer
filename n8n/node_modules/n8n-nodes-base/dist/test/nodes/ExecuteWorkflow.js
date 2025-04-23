"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ExecuteWorkflow_exports = {};
__export(ExecuteWorkflow_exports, {
  executeWorkflow: () => executeWorkflow
});
module.exports = __toCommonJS(ExecuteWorkflow_exports);
var import_di = require("@n8n/di");
var import_jest_mock_extended = require("jest-mock-extended");
var import_n8n_core = require("n8n-core");
var import_n8n_workflow = require("n8n-workflow");
var import_nock = __toESM(require("nock"));
var import_credentials_helper = require("./credentials-helper");
var import_node_types = require("./node-types");
var import_Helpers = require("./Helpers");
async function executeWorkflow(testData) {
  const nodeTypes = import_di.Container.get(import_node_types.NodeTypes);
  if (testData.nock) {
    const { baseUrl, mocks } = testData.nock;
    const agent = (0, import_nock.default)(baseUrl);
    mocks.forEach(
      ({
        method,
        path,
        statusCode,
        requestBody,
        requestHeaders,
        responseBody,
        responseHeaders
      }) => {
        let mock2 = agent[method](path, requestBody);
        if (requestHeaders && Object.keys(requestHeaders).length > 0) {
          Object.entries(requestHeaders).forEach(([key, value]) => {
            mock2 = mock2.matchHeader(key, value);
          });
        }
        mock2.reply(statusCode, responseBody, responseHeaders);
      }
    );
  }
  const executionMode = testData.trigger?.mode ?? "manual";
  const workflowInstance = new import_n8n_workflow.Workflow({
    id: "test",
    nodes: testData.input.workflowData.nodes,
    connections: testData.input.workflowData.connections,
    active: false,
    nodeTypes,
    settings: testData.input.workflowData.settings
  });
  const waitPromise = (0, import_n8n_workflow.createDeferredPromise)();
  const nodeExecutionOrder = [];
  const hooks = new import_n8n_core.ExecutionLifecycleHooks("trigger", "1", (0, import_jest_mock_extended.mock)());
  hooks.addHandler("nodeExecuteAfter", (nodeName) => {
    nodeExecutionOrder.push(nodeName);
  });
  hooks.addHandler("workflowExecuteAfter", (fullRunData) => waitPromise.resolve(fullRunData));
  const additionalData = (0, import_jest_mock_extended.mock)({
    credentialsHelper: import_di.Container.get(import_credentials_helper.CredentialsHelper),
    hooks,
    // Get from node.parameters
    currentNodeParameters: void 0
  });
  let executionData;
  const runExecutionData = {
    resultData: {
      runData: {}
    },
    executionData: {
      metadata: {},
      contextData: {},
      waitingExecution: {},
      waitingExecutionSource: null,
      nodeExecutionStack: [
        {
          node: workflowInstance.getStartNode(),
          data: {
            main: [[testData.trigger?.input ?? { json: {} }]]
          },
          source: null
        }
      ]
    }
  };
  const workflowExecute = new import_n8n_core.WorkflowExecute(additionalData, executionMode, runExecutionData);
  executionData = await workflowExecute.processRunExecutionData(workflowInstance);
  const result = await waitPromise.promise;
  return { executionData, result, nodeExecutionOrder };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  executeWorkflow
});
//# sourceMappingURL=ExecuteWorkflow.js.map