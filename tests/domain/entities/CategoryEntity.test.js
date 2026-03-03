import { describe, it, expect } from "@jest/globals";
import CategoryEntity from "../../../src/domain/entities/category.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("CategoryEntity", () => {
  const categoryData = {
    name: "Tecnología",
    slug: "tecnologia",
    createdBy: "user123",
    isGlobal: true,
  };

  it("should create a valid category", () => {
    const category = new CategoryEntity(categoryData);

    expect(category.name).toBe(categoryData.name);
    expect(category.slug).toBe(categoryData.slug);
    expect(category.createdBy).toBe(categoryData.createdBy);
    expect(category.isGlobal).toBe(categoryData.isGlobal);
    expect(category.toObject()).toEqual(categoryData);
  });

  it("should throw InvalidInputError if name is missing", () => {
    expect(() => new CategoryEntity({ ...categoryData, name: null })).toThrow(
      InvalidInputError,
    );
  });

  it("should throw InvalidInputError if slug is missing", () => {
    expect(() => new CategoryEntity({ ...categoryData, slug: "" })).toThrow(
      InvalidInputError,
    );
  });

  it("should ensure name is accessible via getter", () => {
    const category = new CategoryEntity(categoryData);
    expect(category.name).toBe(categoryData.name);
  });
});
