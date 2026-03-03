import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UpdateArticleUseCase from "../../../src/application/article/updateArticle.usecase.js";

describe("UpdateArticleUseCase", () => {
  let articleRepository,
    notificationRepository,
    articleFactory,
    notificationFactory,
    socketService;
  let updateArticleUseCase;

  beforeEach(() => {
    articleRepository = { update: jest.fn() };
    notificationRepository = { create: jest.fn() };
    articleFactory = { create: jest.fn() };
    notificationFactory = { create: jest.fn() };
    socketService = { sendNotification: jest.fn() };

    updateArticleUseCase = new UpdateArticleUseCase({
      articleRepository,
      notificationRepository,
      articleFactory,
      notificationFactory,
      socketService,
    });
  });

  it("should successfully update", async () => {
    const mockData = { title: "New", slug: "s", author: "u1" };
    const mockEntity = { toObject: () => mockData };
    articleFactory.create.mockReturnValue(mockEntity);
    articleRepository.update.mockResolvedValue(mockData);
    notificationFactory.create.mockReturnValue({ toObject: () => ({}) });
    notificationRepository.create.mockResolvedValue({ id: "n1" });

    const result = await updateArticleUseCase.execute(mockData);

    expect(result.title).toBe("New");
    expect(articleRepository.update).toHaveBeenCalled();
  });
});
