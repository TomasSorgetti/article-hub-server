import { NotFoundError } from "../../domain/errors/index.js";

export default class GetArticleUseCase {
  #articleRepository;
  #socketService;

  constructor({ articleRepository, socketService }) {
    this.#articleRepository = articleRepository;
    this.#socketService = socketService;
  }

  async execute({ slug, isAdmin = false }) {
    const article = await this.#articleRepository.findBySlug(slug);

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    if (!isAdmin) {
      const updatedArticle = await this.#articleRepository.incrementViews(
        article._id || article.id,
      );

      return updatedArticle;
    }

    // if (this.#redisService) {
    //   await this.#redisService.set(cacheKey, article, 3600);
    // }

    return article;
  }
}
