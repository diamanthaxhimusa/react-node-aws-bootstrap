// @flow
import { ObjectId } from 'mongodb';
import BaseRepository from '@repositories/base-repository';
import { ARTICLE_COLLECTION_NAME, ArticleModel } from '@models/ArticleModel';
import type { CreateArticleRequest, UpdateArticleRequest } from '@models/requests/Article.requests';
import Logger from '@utils/logger';

const logger = new Logger('ArticleRepository');

class ArticleRepository extends BaseRepository {

	async fetch(): Promise<ArticleModel[]> {
		const client = await this.getMongoClient();
		return client.collection(ARTICLE_COLLECTION_NAME).find({ isDeleted: { $ne: true } }).toArray();
	}

	async get(articleID: string): Promise<ArticleModel> {
		const client = await this.getMongoClient();
		return client.collection(ARTICLE_COLLECTION_NAME).findOne({ _id: new ObjectId(articleID), isDeleted: { $ne: true } });
	}

	async create(payload: CreateArticleRequest): Promise<{ _id: string }> {
		const client = await this.getMongoClient();
		const response = await client.collection(ARTICLE_COLLECTION_NAME).insertOne(payload);
		logger.info('Article created');

		return response.insertedId;
	}

	async update(articleID: string, payload: UpdateArticleRequest): Promise<ArticleModel> {
		const client = await this.getMongoClient();
		const query = {
			_id: new ObjectId(articleID)
		};

		if (!global['isFromEvent'] && payload.version) {
			const version = payload.version;
			delete payload.version;
			query.version = version;
		}

		await client.collection(ARTICLE_COLLECTION_NAME)
		.updateOne(
			query,
			{
				$set: { ...payload },
				$inc: { version: 1 }
			},
		);

		return client.collection(ARTICLE_COLLECTION_NAME).findOne({ _id: new ObjectId(articleID) });
	}

	async delete(id: string) {
		const client = await this.getMongoClient();
		logger.info('Deleting article');
		return client.collection(ARTICLE_COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, {
			$set: {
				isDeleted: true,
				deletedAt: new Date().getTime(),
				},
			$inc: { version: 1 }
		});
	}
}
export default new ArticleRepository();
