/**
 * @swagger
 *
 * definitions:
 *   CreateArticleRequest:
 *     type: object
 */
export interface CreateArticleRequest {
}

/**
 * @swagger
 *
 * definitions:
 *   UpdateArticleRequest:
 *     allOf:
 *       - $ref: '#/definitions/CreateArticleRequest'
 *       - properties:
 *           version:
 *             type: number
 *             minimum: 1
 *       - required:
 *         - version
 */
export interface UpdateArticleRequest extends CreateArticleRequest {
	version: number;
}
