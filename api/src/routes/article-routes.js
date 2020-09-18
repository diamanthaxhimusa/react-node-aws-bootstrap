// @flow
import { Router } from 'express';
import articleService from '@services/article-service';
import { GetRouteParam } from '@utils/router-helpers';
import Logger from '@utils/logger';
import ExceptionParser from '@exceptions/exception-parser';

const router = new Router({ mergeParams: true });
export const ARTICLE_ID_ROUTE_PARAM = ':articleID';

const logger = new Logger('ArticleRouter');

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Return list of Articles
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: List of Articles
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ArticleModel'
 */
router.get('/', async (request, response) => {
	try {
		const articles = await articleService.fetch();
		return response.json(articles);
	} catch (exception) {
		logger.error('Failed to fetch Articles', exception);
		return response.status(500).send();
	}
});

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new Article
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: payload
 *         description: Article object
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/CreateArticleRequest'
 *     responses:
 *       201:
 *         description: Created Article
 *         schema:
 *           $ref: '#/definitions/ArticleModel'
 */
router.post('/', async (request, response) => {
	try {
		const article = await articleService.create(request.body);
		return response.json(article);
	} catch (exception) {
		logger.error('Failed to create article', exception);
		const error = ExceptionParser.toJson(exception);
		return response.status(error.code).json(error);
	}
});

/**
 * @swagger
 * /articles/{articleID}:
 *   parameters:
 *     - name: articleID
 *       in: path
 *       required: true
 *       type: string
 *   get:
 *     summary: Return requested Article
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Requested Article
 *         schema:
 *           $ref: '#/definitions/ArticleModel'
 */
router.get(`/${ARTICLE_ID_ROUTE_PARAM}`, async (request, response) => {
	try {
		const article = await articleService.get(GetRouteParam(request.params, ARTICLE_ID_ROUTE_PARAM));
		return response.json(article);
	} catch (exception) {
		logger.error('Failed to get article', exception);
		const error = ExceptionParser.toJson(exception);
		return response.status(error.code).json(error);
	}
});


/**
 * @swagger
 * /articles/{articleID}:
 *   parameters:
 *     - name: articleID
 *       in: path
 *       required: true
 *       type: string
 *   patch:
 *     parameters:
 *       - name: payload
 *         description: Article object
 *         in: body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/UpdateArticleRequest'
 *     summary: Update Article
 *     tags:
 *       - Articles
 *     responses:
 *       200:
 *         description: Updated Article
 *         schema:
 *           $ref: '#/definitions/ArticleModel'
 */
router.patch(`/${ARTICLE_ID_ROUTE_PARAM}`, async (request, response) => {
  try {
		const article = await articleService.patch(
			GetRouteParam(request.params, ARTICLE_ID_ROUTE_PARAM),
			request.body
		);
		return response.json( article);
  } catch (exception) {
		logger.error('Failed to patch article', exception);
		const error = ExceptionParser.toJson(exception);
		return response.status(error.code).json(error);
  }
});

/**
 * @swagger
 * /articles/{articleID}:
 *   parameters:
 *     - name: articleID
 *       in: path
 *       required: true
 *       type: string
 *   delete:
 *     summary: Delete Article
 *     tags:
 *       - Articles
 *     responses:
 *       204:
 *         description: Article deleted successfully
 */
router.delete(`/${ARTICLE_ID_ROUTE_PARAM}`, async (request, response) => {
	try {
		await articleService.delete(
			GetRouteParam(request.params, ARTICLE_ID_ROUTE_PARAM)
		);
		return response.status(204).send();
	} catch (exception) {
		logger.error('Failed to delete a article', exception);
		const error = ExceptionParser.toJson(exception);
		return response.status(error.code).json(error);
	}
});

export default router;
