import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import CreateWorkbenchUseCase from "../../../src/application/workbench/create.usecase.js";

describe("CreateWorkbenchUseCase", () => {
  let workbenchRepository, workbenchFactory;
  let createWorkbenchUseCase;

  beforeEach(() => {
    workbenchRepository = { create: jest.fn(), findById: jest.fn() };
    workbenchFactory = { create: jest.fn() };
    createWorkbenchUseCase = new CreateWorkbenchUseCase({
      workbenchRepository,
      workbenchFactory,
    });
  });

  it("should successfully create a workbench", async () => {
    const mockWbEntity = {
      toObject: jest
        .fn()
        .mockReturnValue({ name: "Work 1", owner: "u1", description: "D" }),
      sanitized: jest.fn().mockReturnValue({ id: "wb1", name: "Work 1" }),
    };
    workbenchFactory.create.mockReturnValue(mockWbEntity);
    workbenchRepository.create.mockResolvedValue({
      _id: "wb1",
      name: "Work 1",
    });
    workbenchRepository.findById.mockResolvedValue({
      id: "wb1",
      name: "Work 1",
    });

    const result = await createWorkbenchUseCase.execute({
      userId: "u1",
      name: "Work 1",
      description: "D",
    });

    expect(result.id).toBe("wb1");
    expect(workbenchRepository.create).toHaveBeenCalled();
  });
});
