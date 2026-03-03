import { InvalidInputError } from "../errors/index.js";
import ERROR_CODES from "../errors/errorCodes.js";

export default class ArticleEntity {
  #title;
  #slug;
  #content;
  #summary;
  #author;
  #tags;
  #status;
  #image;
  #isFeatured;
  #categories;
  #workbench;

  constructor({
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
    if (!title || typeof title !== "string") {
      throw new InvalidInputError("Title is required and must be a string", {
        field: "title",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }
    if (title.trim().length < 10) {
      throw new InvalidInputError("Title must be at least 10 characters long", {
        field: "title",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (!slug || typeof slug !== "string") {
      throw new InvalidInputError("Slug is required and must be a string", {
        field: "slug",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      throw new InvalidInputError(
        "Slug must contain only lowercase letters, numbers, and hyphens",
        { field: "slug", code: ERROR_CODES.VALIDATION.INVALID_INPUT },
      );
    }

    if (!content || typeof content !== "string") {
      throw new InvalidInputError("Content is required and must be a string", {
        field: "content",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (!summary || typeof summary !== "string") {
      throw new InvalidInputError("Summary is required and must be a string", {
        field: "summary",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }
    if (summary.trim().length > 500) {
      throw new InvalidInputError("Summary must not exceed 500 characters", {
        field: "summary",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (author && typeof author !== "string") {
      throw new InvalidInputError("Author must be a string", {
        field: "author",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (tags && typeof tags !== "string") {
      throw new InvalidInputError("Tags must be a string", {
        field: "tags",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (status && !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
      throw new InvalidInputError(
        `${status} is not a valid status. Must be one of: DRAFT, PUBLISHED, ARCHIVED`,
        { field: "status", code: ERROR_CODES.VALIDATION.INVALID_INPUT },
      );
    }

    if (isFeatured !== undefined && typeof isFeatured !== "boolean") {
      throw new InvalidInputError("isFeatured must be a boolean", {
        field: "isFeatured",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (!workbench || typeof workbench !== "string") {
      throw new InvalidInputError(
        "workbench is required and must be a string",
        {
          field: "workbench",
          code: ERROR_CODES.VALIDATION.INVALID_INPUT,
        },
      );
    }

    this.#title = title.trim();
    this.#slug = slug.trim().toLowerCase();
    this.#content = content.trim();
    this.#summary = summary.trim();
    this.#author = author ? author.trim() : undefined;
    this.#tags = tags ? tags.trim() : undefined;
    this.#status = status || "DRAFT";
    this.#image = image ? image.trim() : undefined;
    this.#isFeatured = isFeatured ?? false;
    this.#categories = categories ?? [];
    this.#workbench = workbench.trim();
  }

  get title() {
    return this.#title;
  }

  get slug() {
    return this.#slug;
  }

  get content() {
    return this.#content;
  }

  get summary() {
    return this.#summary;
  }

  get author() {
    return this.#author;
  }

  get tags() {
    return this.#tags;
  }

  get status() {
    return this.#status;
  }

  get image() {
    return this.#image;
  }

  get isFeatured() {
    return this.#isFeatured;
  }

  get categories() {
    return this.#categories;
  }

  toObject() {
    return {
      title: this.#title,
      slug: this.#slug,
      content: this.#content,
      summary: this.#summary,
      author: this.#author,
      tags: this.#tags,
      status: this.#status,
      image: this.#image,
      isFeatured: this.#isFeatured,
      categories: this.#categories,
      workbench: this.#workbench,
    };
  }
}
