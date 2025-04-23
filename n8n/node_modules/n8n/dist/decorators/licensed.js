"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Licensed = void 0;
const controller_registry_1 = require("./controller.registry");
const Licensed = (licenseFeature) => (target, handlerName) => {
    const routeMetadata = (0, controller_registry_1.getRouteMetadata)(target.constructor, String(handlerName));
    routeMetadata.licenseFeature = licenseFeature;
};
exports.Licensed = Licensed;
//# sourceMappingURL=licensed.js.map