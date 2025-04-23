import type { InstalledPackages } from '../databases/entities/installed-packages';
import { EventService } from '../events/event.service';
import { Push } from '../push';
import { NodeRequest } from '../requests';
import { CommunityPackagesService } from '../services/community-packages.service';
export declare function isNpmError(error: unknown): error is {
    code: number;
    stdout: string;
};
export declare class CommunityPackagesController {
    private readonly push;
    private readonly communityPackagesService;
    private readonly eventService;
    constructor(push: Push, communityPackagesService: CommunityPackagesService, eventService: EventService);
    installPackage(req: NodeRequest.Post): Promise<InstalledPackages>;
    getInstalledPackages(): Promise<InstalledPackages[] | import("n8n-workflow").PublicInstalledPackage[]>;
    uninstallPackage(req: NodeRequest.Delete): Promise<void>;
    updatePackage(req: NodeRequest.Update): Promise<InstalledPackages>;
}
