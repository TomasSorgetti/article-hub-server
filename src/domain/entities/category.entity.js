import { InvalidInputError } from "../errors/index.js";
import ERROR_CODES from "../errors/errorCodes.js";

export default class CategoryEntity {
  #name;
  #createdBy;
  #slug;
  #isGlobal;

  constructor({ createdBy, isGlobal = false, name, slug }) {
    if (!name || typeof name !== "string") {
      throw new InvalidInputError("Name is required and must be a string", {
        field: "name",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    if (!slug || typeof slug !== "string") {
      throw new InvalidInputError("Slug is required and must be a string", {
        field: "slug",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    this.#createdBy = createdBy;
    this.#isGlobal = isGlobal;
    this.#name = name;
    this.#slug = slug;
  }

  get name() {
    return this.#name;
  }
  get createdBy() {
    return this.#createdBy;
  }
  get slug() {
    return this.#slug;
  }
  get isGlobal() {
    return this.#isGlobal;
  }

  toObject() {
    return {
      name: this.#name,
      createdBy: this.#createdBy,
      slug: this.#slug,
      isGlobal: this.#isGlobal,
    };
  }
}
