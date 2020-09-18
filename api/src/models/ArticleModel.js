// @flow
import { BaseModel } from './BaseModel';

export const ARTICLE_COLLECTION_NAME = 'articles';
/**
 * Article collection
 *
 * @swagger
 *
 * definitions:
 *   ArticleModel:
 *     allOf:
 *       - $ref: '#/definitions/BaseModel'
 *       - required:
 *         - _id
 *         - version
 */
export interface ArticleModel extends BaseModel {

}
