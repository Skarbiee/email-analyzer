"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Redactable = void 0;
const redactable_error_1 = require("../errors/redactable.error");
function toRedactable(userLike) {
    return {
        userId: userLike.id,
        _email: userLike.email,
        _firstName: userLike.firstName,
        _lastName: userLike.lastName,
        globalRole: userLike.role,
    };
}
const Redactable = (fieldName = 'user') => (_target, _propertyName, propertyDescriptor) => {
    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = function (...args) {
        const index = args.findIndex((arg) => arg[fieldName] !== undefined);
        if (index === -1)
            throw new redactable_error_1.RedactableError(fieldName, args.toString());
        const userLike = args[index]?.[fieldName];
        if (userLike)
            args[index][fieldName] = toRedactable(userLike);
        return originalMethod.apply(this, args);
    };
    return propertyDescriptor;
};
exports.Redactable = Redactable;
//# sourceMappingURL=redactable.js.map