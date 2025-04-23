import type { AnnotationTagMapping } from '../../databases/entities/annotation-tag-mapping.ee';
import type { ExecutionAnnotation } from '../../databases/entities/execution-annotation.ee';
import { WithTimestampsAndStringId } from './abstract-entity';
export declare class AnnotationTagEntity extends WithTimestampsAndStringId {
    name: string;
    annotations: ExecutionAnnotation[];
    annotationMappings: AnnotationTagMapping[];
}
