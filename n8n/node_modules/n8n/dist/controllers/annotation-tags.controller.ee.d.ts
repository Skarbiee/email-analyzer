import { AnnotationTagsRequest } from '../requests';
import { AnnotationTagService } from '../services/annotation-tag.service.ee';
export declare class AnnotationTagsController {
    private readonly annotationTagService;
    constructor(annotationTagService: AnnotationTagService);
    getAll(req: AnnotationTagsRequest.GetAll): Promise<import("../interfaces").IAnnotationTagDb[]>;
    createTag(req: AnnotationTagsRequest.Create): Promise<import("../databases/entities/annotation-tag-entity.ee").AnnotationTagEntity>;
    updateTag(req: AnnotationTagsRequest.Update): Promise<import("../databases/entities/annotation-tag-entity.ee").AnnotationTagEntity>;
    deleteTag(req: AnnotationTagsRequest.Delete): Promise<boolean>;
}
