import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import CreateArticleUseCase from "../../../src/application/article/createArticle.usecase.js";
import { UnauthorizedError } from "../../../src/domain/errors/index.js";

describe("CreateArticleUseCase", () => {
  let articleRepository,
    workbenchRepository,
    notificationRepository,
    socketService;
  let articleFactory, notificationFactory;
  let createArticleUseCase;

  beforeEach(() => {
    articleRepository = { create: jest.fn() };
    workbenchRepository = { userBelongsToWorkbench: jest.fn() };
    notificationRepository = { create: jest.fn() };
    socketService = { sendNotification: jest.fn() };
    articleFactory = { create: jest.fn() };
    notificationFactory = { create: jest.fn() };

    createArticleUseCase = new CreateArticleUseCase({
      articleRepository,
      workbenchRepository,
      notificationRepository,
      socketService,
      articleFactory,
      notificationFactory,
    });
  });

  it("should throw UnauthorizedError if not member", async () => {
    workbenchRepository.userBelongsToWorkbench.mockResolvedValue(false);
    await expect(
      createArticleUseCase.execute({ workbench: "wb1", author: "u1" }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should successfully create article", async () => {
    workbenchRepository.userBelongsToWorkbench.mockResolvedValue(true);
    const mockArticle = { toObject: jest.fn().mockReturnValue({ title: "T" }) };
    articleFactory.create.mockReturnValue(mockArticle);
    const mockNotification = { toObject: jest.fn().mockReturnValue({}) };
    notificationFactory.create.mockReturnValue(mockNotification);
    notificationRepository.create.mockResolvedValue({ id: "n1" });

    await createArticleUseCase.execute({
      title: "T",
      workbench: "wb1",
      author: "u1",
      slug: "s",
    });

    expect(articleRepository.create).toHaveBeenCalled();
    expect(socketService.sendNotification).toHaveBeenCalled();
  });
});
