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
var Helpers_exports = {};
__export(Helpers_exports, {
  createMockExecuteFunction: () => createMockExecuteFunction,
  createTemporaryDir: () => createTemporaryDir,
  equalityTest: () => equalityTest,
  getResultNodeData: () => getResultNodeData,
  getWorkflowFilenames: () => getWorkflowFilenames,
  initBinaryDataService: () => initBinaryDataService,
  readJsonFileSync: () => readJsonFileSync,
  testWorkflows: () => testWorkflows,
  workflowToTests: () => workflowToTests
});
module.exports = __toCommonJS(Helpers_exports);
var import_di = require("@n8n/di");
var import_fs = require("fs");
var import_lodash = require("lodash");
var import_lodash2 = require("lodash");
var import_n8n_core = require("n8n-core");
var import_n8n_workflow = require("n8n-workflow");
var import_nock = __toESM(require("nock"));
var import_os = require("os");
var import_path = __toESM(require("path"));
var import_ExecuteWorkflow = require("./ExecuteWorkflow");
var import_load_nodes_and_credentials = require("./load-nodes-and-credentials");
const baseDir = import_path.default.resolve(__dirname, "../..");
const readJsonFileSync = (filePath) => JSON.parse((0, import_fs.readFileSync)(import_path.default.join(baseDir, filePath), "utf-8"));
const loadNodesAndCredentials = new import_load_nodes_and_credentials.LoadNodesAndCredentials(baseDir);
import_di.Container.set(import_load_nodes_and_credentials.LoadNodesAndCredentials, loadNodesAndCredentials);
beforeAll(async () => await loadNodesAndCredentials.init());
beforeEach(() => import_nock.default.disableNetConnect());
function createTemporaryDir(prefix = "n8n") {
  return (0, import_fs.mkdtempSync)(import_path.default.join((0, import_os.tmpdir)(), prefix));
}
async function initBinaryDataService() {
  const binaryDataService = new import_n8n_core.BinaryDataService();
  await binaryDataService.init({
    mode: "default",
    availableModes: ["default"],
    localStoragePath: createTemporaryDir()
  });
  import_di.Container.set(import_n8n_core.BinaryDataService, binaryDataService);
}
function getResultNodeData(result, testData) {
  return Object.keys(testData.output.nodeData).map((nodeName) => {
    const error = result.data.resultData.error;
    if (error?.cause) throw error.cause;
    if (error) throw error;
    if (result.data.resultData.runData[nodeName] === void 0) {
      Object.keys(result.data.resultData.runData).forEach((key) => {
        const error2 = result.data.resultData.runData[key][0]?.error;
        if (error2) {
          console.log(`Node ${key}
`, error2);
        }
      });
      throw new import_n8n_workflow.ApplicationError(`Data for node "${nodeName}" is missing!`, { level: "warning" });
    }
    const resultData = result.data.resultData.runData[nodeName].map((nodeData) => {
      if (nodeData.data === void 0) {
        return null;
      }
      return nodeData.data.main[0].map((entry) => {
        if (entry.binary && (0, import_lodash2.isEmpty)(entry.binary)) delete entry.binary;
        delete entry.pairedItem;
        return entry;
      });
    });
    return {
      nodeName,
      resultData
    };
  });
}
const equalityTest = async (testData) => {
  const { result } = await (0, import_ExecuteWorkflow.executeWorkflow)(testData);
  const resultNodeData = getResultNodeData(result, testData);
  resultNodeData.forEach(({ nodeName, resultData }) => {
    const msg = `Equality failed for "${testData.description}" at node "${nodeName}"`;
    resultData.forEach((item) => {
      item?.forEach(({ binary, json }) => {
        if (binary) {
          delete binary.data.data;
          delete binary.data.directory;
        }
        if (json.error instanceof Error) {
          json.error = JSON.parse(
            JSON.stringify(json.error, ["message", "name", "description", "context"])
          );
        }
      });
    });
    return expect(resultData, msg).toEqual(testData.output.nodeData[nodeName]);
  });
  expect(result.finished || result.status === "waiting").toEqual(true);
};
const preparePinData = (pinData) => {
  const returnData = Object.keys(pinData).reduce(
    (acc, key) => {
      const data = pinData[key];
      acc[key] = [data];
      return acc;
    },
    {}
  );
  return returnData;
};
const workflowToTests = (workflowFiles) => {
  const testCases = [];
  for (const filePath of workflowFiles) {
    const description = filePath.replace(".json", "");
    const workflowData = readJsonFileSync(
      filePath
    );
    const testDir = import_path.default.join(baseDir, import_path.default.dirname(filePath));
    workflowData.nodes.forEach((node) => {
      if (node.parameters) {
        node.parameters = JSON.parse(
          JSON.stringify(node.parameters).replace(/"C:\\\\Test\\\\(.*)"/, `"${testDir}/$1"`)
        );
      }
    });
    if (workflowData.pinData === void 0) {
      throw new import_n8n_workflow.ApplicationError("Workflow data does not contain pinData", { level: "warning" });
    }
    const nodeData = preparePinData(workflowData.pinData);
    delete workflowData.pinData;
    const { trigger } = workflowData;
    delete workflowData.trigger;
    const input = { workflowData };
    const output = { nodeData };
    testCases.push({ description, input, output, trigger });
  }
  return testCases;
};
const testWorkflows = (workflows) => {
  const tests = workflowToTests(workflows);
  for (const testData of tests) {
    test(testData.description, async () => await equalityTest(testData));
  }
};
const getWorkflowFilenames = (dirname) => {
  const workflows = [];
  const filenames = (0, import_fs.readdirSync)(dirname);
  const testFolder = dirname.split(`${import_path.default.sep}nodes-base${import_path.default.sep}`)[1];
  filenames.forEach((file) => {
    if (file.endsWith(".json")) {
      workflows.push(import_path.default.join(testFolder, file));
    }
  });
  return workflows;
};
const createMockExecuteFunction = (nodeParameters, nodeMock, continueBool = false) => {
  const fakeExecuteFunction = {
    getNodeParameter(parameterName, _itemIndex, fallbackValue, options) {
      const parameter = options?.extractValue ? `${parameterName}.value` : parameterName;
      return (0, import_lodash.get)(nodeParameters, parameter, fallbackValue);
    },
    getNode() {
      return nodeMock;
    },
    continueOnFail() {
      return continueBool;
    },
    helpers: {
      constructExecutionMetaData: import_n8n_core.constructExecutionMetaData
    }
  };
  return fakeExecuteFunction;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMockExecuteFunction,
  createTemporaryDir,
  equalityTest,
  getResultNodeData,
  getWorkflowFilenames,
  initBinaryDataService,
  readJsonFileSync,
  testWorkflows,
  workflowToTests
});
//# sourceMappingURL=Helpers.js.map