import ArticleEntity from "../entities/article.entity.js";

export default class ArticleFactory {
  create({
    title,
    content,
    summary,
    author,
    tags,
    slug,
    status = "DRAFT",
    image,
    isFeatured = false,
    categories = [],
    workbench,
  }) {
    return new ArticleEntity({
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
  }
}
