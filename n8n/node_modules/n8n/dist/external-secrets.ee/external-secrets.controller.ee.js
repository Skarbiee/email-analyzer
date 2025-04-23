"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalSecretsController = void 0;
const decorators_1 = require("../decorators");
const external_secrets_provider_not_found_error_1 = require("../errors/external-secrets-provider-not-found.error");
const not_found_error_1 = require("../errors/response-errors/not-found.error");
const external_secrets_service_ee_1 = require("./external-secrets.service.ee");
let ExternalSecretsController = class ExternalSecretsController {
    constructor(secretsService) {
        this.secretsService = secretsService;
    }
    async getProviders() {
        return await this.secretsService.getProviders();
    }
    async getProvider(req) {
        const providerName = req.params.provider;
        try {
            return this.secretsService.getProvider(providerName);
        }
        catch (e) {
            if (e instanceof external_secrets_provider_not_found_error_1.ExternalSecretsProviderNotFoundError) {
                throw new not_found_error_1.NotFoundError(`Could not find provider "${e.providerName}"`);
            }
            throw e;
        }
    }
    async testProviderSettings(req, res) {
        const providerName = req.params.provider;
        try {
            const result = await this.secretsService.testProviderSettings(providerName, req.body);
            if (result.success) {
                res.statusCode = 200;
            }
            else {
                res.statusCode = 400;
            }
            return result;
        }
        catch (e) {
            if (e instanceof external_secrets_provider_not_found_error_1.ExternalSecretsProviderNotFoundError) {
                throw new not_found_error_1.NotFoundError(`Could not find provider "${e.providerName}"`);
            }
            throw e;
        }
    }
    async setProviderSettings(req) {
        const providerName = req.params.provider;
        try {
            await this.secretsService.saveProviderSettings(providerName, req.body, req.user.id);
        }
        catch (e) {
            if (e instanceof external_secrets_provider_not_found_error_1.ExternalSecretsProviderNotFoundError) {
                throw new not_found_error_1.NotFoundError(`Could not find provider "${e.providerName}"`);
            }
            throw e;
        }
        return {};
    }
    async setProviderConnected(req) {
        const providerName = req.params.provider;
        try {
            await this.secretsService.saveProviderConnected(providerName, req.body.connected);
        }
        catch (e) {
            if (e instanceof external_secrets_provider_not_found_error_1.ExternalSecretsProviderNotFoundError) {
                throw new not_found_error_1.NotFoundError(`Could not find provider "${e.providerName}"`);
            }
            throw e;
        }
        return {};
    }
    async updateProvider(req, res) {
        const providerName = req.params.provider;
        try {
            const resp = await this.secretsService.updateProvider(providerName);
            if (resp) {
                res.statusCode = 200;
            }
            else {
                res.statusCode = 400;
            }
            return { updated: resp };
        }
        catch (e) {
            if (e instanceof external_secrets_provider_not_found_error_1.ExternalSecretsProviderNotFoundError) {
                throw new not_found_error_1.NotFoundError(`Could not find provider "${e.providerName}"`);
            }
            throw e;
        }
    }
    getSecretNames() {
        return this.secretsService.getAllSecrets();
    }
};
exports.ExternalSecretsController = ExternalSecretsController;
__decorate([
    (0, decorators_1.Get)('/providers'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "getProviders", null);
__decorate([
    (0, decorators_1.Get)('/providers/:provider'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "getProvider", null);
__decorate([
    (0, decorators_1.Post)('/providers/:provider/test'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:read'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "testProviderSettings", null);
__decorate([
    (0, decorators_1.Post)('/providers/:provider'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:create'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "setProviderSettings", null);
__decorate([
    (0, decorators_1.Post)('/providers/:provider/connect'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:update'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "setProviderConnected", null);
__decorate([
    (0, decorators_1.Post)('/providers/:provider/update'),
    (0, decorators_1.GlobalScope)('externalSecretsProvider:sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExternalSecretsController.prototype, "updateProvider", null);
__decorate([
    (0, decorators_1.Get)('/secrets'),
    (0, decorators_1.GlobalScope)('externalSecret:list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExternalSecretsController.prototype, "getSecretNames", null);
exports.ExternalSecretsController = ExternalSecretsController = __decorate([
    (0, decorators_1.RestController)('/external-secrets'),
    __metadata("design:paramtypes", [external_secrets_service_ee_1.ExternalSecretsService])
], ExternalSecretsController);
//# sourceMappingURL=external-secrets.controller.ee.js.map