import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteWorkbenchUseCase from "../../../src/application/workbench/delete.usecase.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../../src/domain/errors/index.js";

describe("DeleteWorkbenchUseCase", () => {
  let workbenchRepository;
  let deleteWorkbenchUseCase;

  beforeEach(() => {
    workbenchRepository = { findById: jest.fn(), delete: jest.fn() };
    deleteWorkbenchUseCase = new DeleteWorkbenchUseCase({
      workbenchRepository,
    });
  });

  it("should throw NotFoundError if workbench not found", async () => {
    workbenchRepository.findById.mockResolvedValue(null);
    await expect(
      deleteWorkbenchUseCase.execute({ userId: "u1", workbenchId: "wb1" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw ForbiddenError if not owner", async () => {
    workbenchRepository.findById.mockResolvedValue({ owner: "u2" });
    await expect(
      deleteWorkbenchUseCase.execute({ userId: "u1", workbenchId: "wb1" }),
    ).rejects.toThrow(ForbiddenError);
  });

  it("should successfully delete", async () => {
    workbenchRepository.findById.mockResolvedValue({ owner: "u1" });
    workbenchRepository.delete.mockResolvedValue({ id: "wb1" });

    const result = await deleteWorkbenchUseCase.execute({
      userId: "u1",
      workbenchId: "wb1",
    });

    expect(result.id).toBe("wb1");
    expect(workbenchRepository.delete).toHaveBeenCalledWith("wb1");
  });
});
