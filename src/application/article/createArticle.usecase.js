import ArticleEntity from "../../domain/entities/article.entity.js";
import NotificationEntity from "../../domain/entities/notification.entity.js";
import { UnauthorizedError } from "../../domain/errors/index.js";

export default class CreateArticleUseCase {
  #articleRepository;
  #workbenchRepository;
  #redisService;
  #notificationRepository;
  #socketService;

  constructor({
    articleRepository,
    workbenchRepository,
    notificationRepository,
    socketService,
  }) {
    this.#articleRepository = articleRepository;
    this.#notificationRepository = notificationRepository;
    this.#socketService = socketService;
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

    const newArticle = new ArticleEntity({
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
    });

    await this.#articleRepository.create(newArticle.toObject());

    const notificationEntity = new NotificationEntity({
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
