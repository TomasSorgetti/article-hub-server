export default class UpdateArticleUseCase {
  #articleRepository;
  #notificationRepository;
  #socketService;
  #articleFactory;
  #notificationFactory;

  constructor({
    articleRepository,
    notificationRepository,
    socketService,
    articleFactory,
    notificationFactory,
  }) {
    this.#articleRepository = articleRepository;
    this.#notificationRepository = notificationRepository;
    this.#socketService = socketService;
    this.#articleFactory = articleFactory;
    this.#notificationFactory = notificationFactory;
  }

  async execute(articleData) {
    const articleEntity = this.#articleFactory.create(articleData);
    const article = articleEntity.toObject();

    const updatedArticle = await this.#articleRepository.update(
      article.slug,
      article,
    );

    const notificationEntity = this.#notificationFactory.create({
      userId: article.author,
      type: "activity",
      message: `¡${article.title} has been updated!`,
      link: `/article/${article.slug}`,
    });

    try {
      const notification = await this.#notificationRepository.create(
        notificationEntity.toObject(),
      );
      this.#socketService.sendNotification(article.author, notification);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }

    return updatedArticle;
  }
}
