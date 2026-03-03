import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetArticlesUseCase from "../../../src/application/article/getArticles.usecase.js";

describe("GetArticlesUseCase", () => {
  let articleRepository;
  let getArticlesUseCase;

  beforeEach(() => {
    articleRepository = { findAllByWorkbench: jest.fn() };
    getArticlesUseCase = new GetArticlesUseCase({ articleRepository });
  });

  it("should successfully return articles", async () => {
    articleRepository.findAllByWorkbench.mockResolvedValue({
      items: [],
      total: 0,
    });
    const result = await getArticlesUseCase.execute("wb1");
    expect(result.total).toBe(0);
  });
});
