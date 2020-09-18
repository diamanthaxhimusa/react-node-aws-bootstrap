// @flow
import type { ArticleModel } from '@models/ArticleModel';
import type { CreateArticleRequest, UpdateArticleRequest } from '@models/requests/Article.requests';
import Logger from '@utils/logger';
import articleRepository from '@repositories/article-repository';
import { DatabaseHelper } from '@utils/database-helper';
// eslint-disable-next-line no-unused-vars
import Exception from '@exceptions/exception';

const logger = new Logger('ArticleService');

class ArticleService {

	// eslint-disable-next-line no-undef
	static async #exist(articleID: string) {
		const article = await articleRepository.get(articleID);
		if (!article) {
			logger.error(`Article with id: ${articleID} does not exist`);
			throw new Exception(404, 'Article not found');
		} else {
			logger.info(`Found article with id: ${articleID}`);
		}
	}

	fetch(): Promise<ArticleModel[]> {
		logger.info('Getting Articles');
		return articleRepository.fetch();
	}

	get(articleID: string): Promise<ArticleModel> {
		logger.info('Getting  article');
		logger.debug('Getting  article with ID:', articleID);
		return articleRepository.get(articleID);
	}

	async create(payload: CreateArticleRequest): Promise<ArticleModel> {
		logger.info('Creating article');
		logger.debug('Creating article with payload: ', payload);
		DatabaseHelper.SetModified(payload);
		const article: ArticleModel = payload;
		article._id = await articleRepository.create(payload);

		return article;
	}

	async patch(articleID: string, payload: UpdateArticleRequest): Promise<ArticleModel> {
		await ArticleService.#exist(articleID);
		logger.info('Updating article');
		DatabaseHelper.SetModified(payload);

		await articleRepository.update(articleID, payload);
		return this.get(articleID);
	}

	async delete(articleID: string): Promise<boolean> {
		await ArticleService.#exist(articleID);
		logger.info('Deleting article');
		await articleRepository.delete(articleID);

		return true;
	}
}

export default new ArticleService();
