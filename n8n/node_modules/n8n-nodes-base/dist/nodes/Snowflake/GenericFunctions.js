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
var GenericFunctions_exports = {};
__export(GenericFunctions_exports, {
  connect: () => connect,
  destroy: () => destroy,
  execute: () => execute
});
module.exports = __toCommonJS(GenericFunctions_exports);
async function connect(conn) {
  return await new Promise((resolve, reject) => {
    conn.connect((error) => error ? reject(error) : resolve());
  });
}
async function destroy(conn) {
  return await new Promise((resolve, reject) => {
    conn.destroy((error) => error ? reject(error) : resolve());
  });
}
async function execute(conn, sqlText, binds) {
  return await new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (error, _, rows) => error ? reject(error) : resolve(rows)
    });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connect,
  destroy,
  execute
});
//# sourceMappingURL=GenericFunctions.js.map