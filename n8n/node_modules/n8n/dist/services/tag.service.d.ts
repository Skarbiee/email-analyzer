import type { TagEntity } from '../databases/entities/tag-entity';
import { TagRepository } from '../databases/repositories/tag.repository';
import { ExternalHooks } from '../external-hooks';
import type { ITagWithCountDb } from '../interfaces';
type GetAllResult<T> = T extends {
    withUsageCount: true;
} ? ITagWithCountDb[] : TagEntity[];
export declare class TagService {
    private externalHooks;
    private tagRepository;
    constructor(externalHooks: ExternalHooks, tagRepository: TagRepository);
    toEntity(attrs: {
        name: string;
        id?: string;
    }): TagEntity;
    save(tag: TagEntity, actionKind: 'create' | 'update'): Promise<TagEntity>;
    delete(id: string): Promise<import("@n8n/typeorm").DeleteResult>;
    getAll<T extends {
        withUsageCount: boolean;
    }>(options?: T): Promise<GetAllResult<T>>;
    getById(id: string): Promise<TagEntity>;
    sortByRequestOrder(tags: TagEntity[], { requestOrder }: {
        requestOrder: string[];
    }): TagEntity[];
}
export {};
