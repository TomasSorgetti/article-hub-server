import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteCategoryUseCase from "../../../src/application/category/delete.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("DeleteCategoryUseCase", () => {
  let categoryRepository;
  let deleteCategoryUseCase;

  beforeEach(() => {
    categoryRepository = { delete: jest.fn() };
    deleteCategoryUseCase = new DeleteCategoryUseCase({ categoryRepository });
  });

  it("should throw NotFoundError if delete fails", async () => {
    categoryRepository.delete.mockResolvedValue(null);
    await expect(
      deleteCategoryUseCase.execute({ userId: "u1", id: "c1" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should successfully delete category", async () => {
    categoryRepository.delete.mockResolvedValue({ id: "c1" });
    const result = await deleteCategoryUseCase.execute({
      userId: "u1",
      id: "c1",
    });
    expect(result.id).toBe("c1");
    expect(categoryRepository.delete).toHaveBeenCalledWith("c1", "u1");
  });
});
