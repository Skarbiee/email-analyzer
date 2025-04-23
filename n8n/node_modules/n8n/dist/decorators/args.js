"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Param = exports.Query = exports.Body = void 0;
const controller_registry_1 = require("./controller.registry");
const ArgDecorator = (arg) => (target, handlerName, parameterIndex) => {
    const routeMetadata = (0, controller_registry_1.getRouteMetadata)(target.constructor, String(handlerName));
    routeMetadata.args[parameterIndex] = arg;
};
exports.Body = ArgDecorator({ type: 'body' });
exports.Query = ArgDecorator({ type: 'query' });
const Param = (key) => ArgDecorator({ type: 'param', key });
exports.Param = Param;
//# sourceMappingURL=args.js.map