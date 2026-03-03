import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import CreateCategoryUseCase from "../../../src/application/category/create.usecase.js";

describe("CreateCategoryUseCase", () => {
  let categoryRepository, categoryFactory;
  let createCategoryUseCase;

  beforeEach(() => {
    categoryRepository = { create: jest.fn() };
    categoryFactory = { create: jest.fn() };
    createCategoryUseCase = new CreateCategoryUseCase({
      categoryRepository,
      categoryFactory,
    });
  });

  it("should successfully create a category", async () => {
    const mockCatEntity = { toObject: () => ({ name: "T" }) };
    categoryFactory.create.mockReturnValue(mockCatEntity);
    categoryRepository.create.mockResolvedValue({ id: "c1" });

    const result = await createCategoryUseCase.execute({
      name: "T",
      userId: "u1",
    });

    expect(result.id).toBe("c1");
    expect(categoryRepository.create).toHaveBeenCalled();
  });
});
