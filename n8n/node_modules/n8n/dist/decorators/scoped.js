"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectScope = exports.GlobalScope = void 0;
const controller_registry_1 = require("./controller.registry");
const Scoped = (scope, { globalOnly } = { globalOnly: false }) => (target, handlerName) => {
    const routeMetadata = (0, controller_registry_1.getRouteMetadata)(target.constructor, String(handlerName));
    routeMetadata.accessScope = { scope, globalOnly };
};
const GlobalScope = (scope) => Scoped(scope, { globalOnly: true });
exports.GlobalScope = GlobalScope;
const ProjectScope = (scope) => Scoped(scope);
exports.ProjectScope = ProjectScope;
//# sourceMappingURL=scoped.js.map