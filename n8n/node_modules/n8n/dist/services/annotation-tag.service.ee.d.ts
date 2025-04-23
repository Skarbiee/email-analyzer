import type { AnnotationTagEntity } from '../databases/entities/annotation-tag-entity.ee';
import { AnnotationTagRepository } from '../databases/repositories/annotation-tag.repository.ee';
import type { IAnnotationTagDb, IAnnotationTagWithCountDb } from '../interfaces';
type GetAllResult<T> = T extends {
    withUsageCount: true;
} ? IAnnotationTagWithCountDb[] : IAnnotationTagDb[];
export declare class AnnotationTagService {
    private tagRepository;
    constructor(tagRepository: AnnotationTagRepository);
    toEntity(attrs: {
        name: string;
        id?: string;
    }): AnnotationTagEntity;
    save(tag: AnnotationTagEntity): Promise<AnnotationTagEntity>;
    delete(id: string): Promise<import("@n8n/typeorm").DeleteResult>;
    getAll<T extends {
        withUsageCount: boolean;
    }>(options?: T): Promise<GetAllResult<T>>;
}
export {};
