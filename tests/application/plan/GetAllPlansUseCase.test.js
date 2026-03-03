import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetAllPlansUseCase from "../../../src/application/plan/getAll.usecase.js";

describe("GetAllPlansUseCase", () => {
  let planRepository;
  let getAllPlansUseCase;

  beforeEach(() => {
    planRepository = { findAllActive: jest.fn() };
    getAllPlansUseCase = new GetAllPlansUseCase({ planRepository });
  });

  it("should successfully return all active plans", async () => {
    const mockPlans = [
      { id: "p1", name: "Free" },
      { id: "p2", name: "Pro" },
    ];
    planRepository.findAllActive.mockResolvedValue(mockPlans);

    const result = await getAllPlansUseCase.execute();

    expect(result.length).toBe(2);
    expect(planRepository.findAllActive).toHaveBeenCalled();
  });
});
