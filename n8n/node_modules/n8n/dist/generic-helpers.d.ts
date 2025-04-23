import type { AnnotationTagEntity } from './databases/entities/annotation-tag-entity.ee';
import type { CredentialsEntity } from './databases/entities/credentials-entity';
import type { TagEntity } from './databases/entities/tag-entity';
import type { TestDefinition } from './databases/entities/test-definition.ee';
import type { User } from './databases/entities/user';
import type { WorkflowEntity } from './databases/entities/workflow-entity';
import type { PersonalizationSurveyAnswersV4 } from './controllers/survey-answers.dto';
export declare function validateEntity(entity: WorkflowEntity | TestDefinition | CredentialsEntity | TagEntity | AnnotationTagEntity | User | PersonalizationSurveyAnswersV4): Promise<void>;
export declare const DEFAULT_EXECUTIONS_GET_ALL_LIMIT = 20;
