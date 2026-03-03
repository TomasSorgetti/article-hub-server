import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetCategoryUseCase from "../../../src/application/category/getOne.usecase.js";

describe("GetCategoryUseCase", () => {
  let categoryRepository;
  let getCategoryUseCase;

  beforeEach(() => {
    categoryRepository = { findById: jest.fn() };
    getCategoryUseCase = new GetCategoryUseCase({ categoryRepository });
  });

  it("should successfully return one category", async () => {
    categoryRepository.findById.mockResolvedValue({ id: "c1", name: "T" });
    const result = await getCategoryUseCase.execute({ id: "c1" });
    expect(result.id).toBe("c1");
    expect(categoryRepository.findById).toHaveBeenCalledWith("c1");
  });
});
