import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetAllCategoriesUseCase from "../../../src/application/category/getAll.usecase.js";

describe("GetAllCategoriesUseCase", () => {
  let categoryRepository;
  let getAllCategoriesUseCase;

  beforeEach(() => {
    categoryRepository = { findAll: jest.fn() };
    getAllCategoriesUseCase = new GetAllCategoriesUseCase({
      categoryRepository,
    });
  });

  it("should successfully return all categories", async () => {
    const mockCats = [
      { id: "c1", name: "Tech" },
      { id: "c2", name: "Science" },
    ];
    categoryRepository.findAll.mockResolvedValue(mockCats);

    const result = await getAllCategoriesUseCase.execute({ userId: "u1" });

    expect(result.length).toBe(2);
    expect(categoryRepository.findAll).toHaveBeenCalledWith({
      $or: [{ createdBy: "u1" }, { isGlobal: true }],
    });
  });
});
