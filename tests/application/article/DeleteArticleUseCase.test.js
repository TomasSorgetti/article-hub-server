import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteArticleUseCase from "../../../src/application/article/deleteArticle.usecase.js";

describe("DeleteArticleUseCase", () => {
  let articleRepository,
    notificationRepository,
    notificationFactory,
    socketService;
  let deleteArticleUseCase;

  beforeEach(() => {
    articleRepository = { delete: jest.fn() };
    notificationRepository = { create: jest.fn() };
    notificationFactory = { create: jest.fn() };
    socketService = { sendNotification: jest.fn() };

    deleteArticleUseCase = new DeleteArticleUseCase({
      articleRepository,
      notificationRepository,
      notificationFactory,
      socketService,
    });
  });

  it("should successfully delete", async () => {
    articleRepository.delete.mockResolvedValue({ slug: "s", author: "u1" });
    notificationFactory.create.mockReturnValue({ toObject: () => ({}) });
    notificationRepository.create.mockResolvedValue({ id: "n1" });

    const result = await deleteArticleUseCase.execute("s");

    expect(result.slug).toBe("s");
    expect(articleRepository.delete).toHaveBeenCalledWith("s");
    expect(socketService.sendNotification).toHaveBeenCalled();
  });
});
