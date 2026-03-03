export default class DeleteArticleUseCase {
  #articleRepository;
  #notificationRepository;
  #socketService;
  #notificationFactory;

  constructor({
    articleRepository,
    notificationRepository,
    socketService,
    notificationFactory,
  }) {
    this.#articleRepository = articleRepository;
    this.#notificationRepository = notificationRepository;
    this.#socketService = socketService;
    this.#notificationFactory = notificationFactory;
  }

  async execute(slug) {
    const deletedInfo = await this.#articleRepository.delete(slug);

    const notificationEntity = this.#notificationFactory.create({
      userId: deletedInfo.author,
      type: "activity",
      message: `¡Article ${deletedInfo.slug} has been deleted!`,
      link: null,
    });

    try {
      const notification = await this.#notificationRepository.create(
        notificationEntity.toObject(),
      );
      this.#socketService.sendNotification(deletedInfo.author, notification);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }

    return deletedInfo;
  }
}
