import { GlobalConfig } from '@n8n/config';
import type { Application } from 'express';
import { AuthService } from '../auth/auth.service';
import { License } from '../license';
import type { Controller, ControllerMetadata, HandlerName, RouteMetadata } from './types';
export declare const getControllerMetadata: (controllerClass: Controller) => ControllerMetadata;
export declare const getRouteMetadata: (controllerClass: Controller, handlerName: HandlerName) => RouteMetadata;
export declare class ControllerRegistry {
    private readonly license;
    private readonly authService;
    private readonly globalConfig;
    constructor(license: License, authService: AuthService, globalConfig: GlobalConfig);
    activate(app: Application): void;
    private activateController;
    private createRateLimitMiddleware;
    private createLicenseMiddleware;
    private createScopedMiddleware;
}
