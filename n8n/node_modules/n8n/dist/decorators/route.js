"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = void 0;
const controller_registry_1 = require("./controller.registry");
const RouteFactory = (method) => (path, options = {}) => (target, handlerName) => {
    const routeMetadata = (0, controller_registry_1.getRouteMetadata)(target.constructor, String(handlerName));
    routeMetadata.method = method;
    routeMetadata.path = path;
    routeMetadata.middlewares = options.middlewares ?? [];
    routeMetadata.usesTemplates = options.usesTemplates ?? false;
    routeMetadata.skipAuth = options.skipAuth ?? false;
    routeMetadata.rateLimit = options.rateLimit;
};
exports.Get = RouteFactory('get');
exports.Post = RouteFactory('post');
exports.Put = RouteFactory('put');
exports.Patch = RouteFactory('patch');
exports.Delete = RouteFactory('delete');
//# sourceMappingURL=route.js.map