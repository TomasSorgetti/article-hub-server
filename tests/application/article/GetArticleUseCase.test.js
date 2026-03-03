import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetArticleUseCase from "../../../src/application/article/getArticle.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("GetArticleUseCase", () => {
  let articleRepository, socketService;
  let getArticleUseCase;

  beforeEach(() => {
    articleRepository = { findBySlug: jest.fn(), incrementViews: jest.fn() };
    socketService = { emitToAll: jest.fn() };
    getArticleUseCase = new GetArticleUseCase({
      articleRepository,
      socketService,
    });
  });

  it("should throw NotFoundError if article not found", async () => {
    articleRepository.findBySlug.mockResolvedValue(null);
    await expect(getArticleUseCase.execute({ slug: "slug" })).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should successfully return article and increment views if not admin", async () => {
    articleRepository.findBySlug.mockResolvedValue({ _id: "a1", title: "T" });
    articleRepository.incrementViews.mockResolvedValue({ _id: "a1", views: 1 });

    const result = await getArticleUseCase.execute({
      slug: "slug",
      isAdmin: false,
    });

    expect(result._id).toBe("a1");
    expect(articleRepository.incrementViews).toHaveBeenCalledWith("a1");
  });

  it("should return article without incrementing views if admin", async () => {
    articleRepository.findBySlug.mockResolvedValue({ _id: "a1", title: "T" });

    const result = await getArticleUseCase.execute({
      slug: "slug",
      isAdmin: true,
    });

    expect(result._id).toBe("a1");
    expect(articleRepository.incrementViews).not.toHaveBeenCalled();
  });
});
