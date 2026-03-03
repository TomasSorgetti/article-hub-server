import { UnauthorizedError } from "../../domain/errors/index.js";

export default class CreateArticleUseCase {
  #articleRepository;
  #workbenchRepository;
  #notificationRepository;
  #socketService;
  #articleFactory;
  #notificationFactory;

  constructor({
    articleRepository,
    workbenchRepository,
    notificationRepository,
    socketService,
    articleFactory,
    notificationFactory,
  }) {
    this.#articleRepository = articleRepository;
    this.#workbenchRepository = workbenchRepository;
    this.#notificationRepository = notificationRepository;
    this.#socketService = socketService;
    this.#articleFactory = articleFactory;
    this.#notificationFactory = notificationFactory;
  }

  async execute({
    title,
    slug,
    content,
    summary,
    author,
    tags,
    status,
    image,
    isFeatured,
    categories,
    workbench,
  }) {
    const isMember = await this.#workbenchRepository.userBelongsToWorkbench(
      workbench,
      author,
    );

    if (!isMember) {
      throw new UnauthorizedError(
        "User is not authorized to create articles in this workbench",
      );
    }

    const newArticle = this.#articleFactory.create({
      title,
      slug,
      content,
      summary,
      author,
      tags,
      status,
      image,
      isFeatured,
      categories,
    });

    await this.#articleRepository.create({
      ...newArticle.toObject(),
      workbench,
    });

    const notificationEntity = this.#notificationFactory.create({
      userId: author,
      type: "activity",
      message: `¡New article created: ${title}!`,
      link: `/articles/${slug}`,
    });

    try {
      const notification = await this.#notificationRepository.create(
        notificationEntity.toObject(),
      );
      this.#socketService.sendNotification(author, notification);
    } catch (err) {
      console.error("Failed to send notification:", err);
    }

    return;
  }
}
