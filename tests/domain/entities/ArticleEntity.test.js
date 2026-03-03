import { describe, it, expect } from "@jest/globals";
import ArticleEntity from "../../../src/domain/entities/article.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("ArticleEntity", () => {
  const validArticleData = {
    title: "Understanding Clean Architecture",
    slug: "understanding-clean-architecture",
    content: "Content about clean architecture...",
    summary: "This article explains the basics of clean architecture.",
    author: "author123",
    tags: "clean,architecture,js",
    status: "PUBLISHED",
    image: "https://example.com/image.jpg",
    isFeatured: true,
    categories: ["cat1", "cat2"],
    workbench: "workbench123",
  };

  it("should create a valid article with all fields", () => {
    const article = new ArticleEntity(validArticleData);

    expect(article.title).toBe(validArticleData.title);
    expect(article.slug).toBe(validArticleData.slug);
    expect(article.content).toBe(validArticleData.content);
    expect(article.summary).toBe(validArticleData.summary);
    expect(article.author).toBe(validArticleData.author);
    expect(article.tags).toBe(validArticleData.tags);
    expect(article.status).toBe(validArticleData.status);
    expect(article.image).toBe(validArticleData.image);
    expect(article.isFeatured).toBe(validArticleData.isFeatured);
    expect(article.categories).toEqual(validArticleData.categories);
  });

  it("should throw error if title is too short", () => {
    expect(
      () => new ArticleEntity({ ...validArticleData, title: "Short" }),
    ).toThrow(InvalidInputError);
  });

  it("should throw error if slug format is invalid", () => {
    expect(
      () => new ArticleEntity({ ...validArticleData, slug: "Invalid Slug!" }),
    ).toThrow(InvalidInputError);
  });

  it("should throw error if status is invalid", () => {
    expect(
      () =>
        new ArticleEntity({ ...validArticleData, status: "INVALID_STATUS" }),
    ).toThrow(InvalidInputError);
  });

  it("should throw error if workbench is missing", () => {
    const { workbench, ...dataWithoutWorkbench } = validArticleData;
    expect(() => new ArticleEntity(dataWithoutWorkbench)).toThrow(
      InvalidInputError,
    );
  });

  it("should return a plain object via toObject()", () => {
    const article = new ArticleEntity(validArticleData);
    const obj = article.toObject();

    expect(obj).toEqual(validArticleData);
    expect(obj.title).toBe(validArticleData.title);
  });
});
