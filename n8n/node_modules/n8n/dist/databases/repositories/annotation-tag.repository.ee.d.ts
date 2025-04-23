import { DataSource, Repository } from '@n8n/typeorm';
import { AnnotationTagEntity } from '../../databases/entities/annotation-tag-entity.ee';
export declare class AnnotationTagRepository extends Repository<AnnotationTagEntity> {
    constructor(dataSource: DataSource);
}
