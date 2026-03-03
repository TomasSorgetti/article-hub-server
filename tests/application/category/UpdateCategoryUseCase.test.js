import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UpdateCategoryUseCase from "../../../src/application/category/update.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("UpdateCategoryUseCase", () => {
  let categoryRepository;
  let updateCategoryUseCase;

  beforeEach(() => {
    categoryRepository = { update: jest.fn() };
    updateCategoryUseCase = new UpdateCategoryUseCase({ categoryRepository });
  });

  it("should throw NotFoundError if category update fails", async () => {
    categoryRepository.update.mockResolvedValue(null);
    await expect(
      updateCategoryUseCase.execute({ userId: "u1", id: "c1", name: "New" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should successfully update category", async () => {
    categoryRepository.update.mockResolvedValue({ id: "c1", name: "New" });
    const result = await updateCategoryUseCase.execute({
      userId: "u1",
      id: "c1",
      name: "New",
    });
    expect(result.name).toBe("New");
    expect(categoryRepository.update).toHaveBeenCalled();
  });
});
