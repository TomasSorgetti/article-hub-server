import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetAllWorkbenchesUseCase from "../../../src/application/workbench/getAll.usecase.js";

describe("GetAllWorkbenchesUseCase", () => {
  let workbenchRepository, workbenchFactory;
  let getAllWorkbenchesUseCase;

  beforeEach(() => {
    workbenchRepository = { findByUserId: jest.fn() };
    workbenchFactory = { create: jest.fn() };
    getAllWorkbenchesUseCase = new GetAllWorkbenchesUseCase({
      workbenchRepository,
      workbenchFactory,
    });
  });

  it("should successfully return all workbenches for user", async () => {
    const mockWbs = [
      { id: "wb1", name: "W1" },
      { id: "wb2", name: "W2" },
    ];
    workbenchRepository.findByUserId.mockResolvedValue(mockWbs);

    const mockWbEntity = {
      sanitized: jest.fn().mockReturnValue({ id: "wbX", name: "WX" }),
    };
    workbenchFactory.create.mockReturnValue(mockWbEntity);

    const result = await getAllWorkbenchesUseCase.execute("u1");

    expect(result.length).toBe(2);
    expect(result[0].id).toBe("wbX");
    expect(workbenchRepository.findByUserId).toHaveBeenCalledWith("u1");
  });
});
