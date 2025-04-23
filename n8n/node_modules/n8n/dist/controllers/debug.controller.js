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
exports.DebugController = void 0;
const n8n_core_1 = require("n8n-core");
const active_workflow_manager_1 = require("../active-workflow-manager");
const workflow_repository_1 = require("../databases/repositories/workflow.repository");
const decorators_1 = require("../decorators");
const orchestration_service_1 = require("../services/orchestration.service");
let DebugController = class DebugController {
    constructor(orchestrationService, activeWorkflowManager, workflowRepository, instanceSettings) {
        this.orchestrationService = orchestrationService;
        this.activeWorkflowManager = activeWorkflowManager;
        this.workflowRepository = workflowRepository;
        this.instanceSettings = instanceSettings;
    }
    async getMultiMainSetupDetails() {
        const leaderKey = await this.orchestrationService.multiMainSetup.fetchLeaderKey();
        const triggersAndPollers = await this.workflowRepository.findIn(this.activeWorkflowManager.allActiveInMemory());
        const webhooks = await this.workflowRepository.findWebhookBasedActiveWorkflows();
        const activationErrors = await this.activeWorkflowManager.getAllWorkflowActivationErrors();
        return {
            instanceId: this.instanceSettings.instanceId,
            leaderKey,
            isLeader: this.instanceSettings.isLeader,
            activeWorkflows: {
                webhooks,
                triggersAndPollers,
            },
            activationErrors,
        };
    }
};
exports.DebugController = DebugController;
__decorate([
    (0, decorators_1.Get)('/multi-main-setup', { skipAuth: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DebugController.prototype, "getMultiMainSetupDetails", null);
exports.DebugController = DebugController = __decorate([
    (0, decorators_1.RestController)('/debug'),
    __metadata("design:paramtypes", [orchestration_service_1.OrchestrationService,
        active_workflow_manager_1.ActiveWorkflowManager,
        workflow_repository_1.WorkflowRepository,
        n8n_core_1.InstanceSettings])
], DebugController);
//# sourceMappingURL=debug.controller.js.map