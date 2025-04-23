"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const controller_registry_1 = require("./controller.registry");
const Middleware = () => (target, handlerName) => {
    const metadata = (0, controller_registry_1.getControllerMetadata)(target.constructor);
    metadata.middlewares.push(String(handlerName));
};
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map