import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetAllSessionsUseCase from "../../../src/application/session/getAll.usecase.js";

describe("GetAllSessionsUseCase", () => {
  let sessionRepository, sessionFactory;
  let getAllSessionsUseCase;

  beforeEach(() => {
    sessionRepository = { findByUserId: jest.fn() };
    sessionFactory = { create: jest.fn() };
    getAllSessionsUseCase = new GetAllSessionsUseCase({
      sessionRepository,
      sessionFactory,
    });
  });

  it("should successfully return all sessions", async () => {
    sessionRepository.findByUserId.mockResolvedValue([{ id: "s1" }]);
    sessionFactory.create.mockReturnValue({ sanitized: () => ({ id: "s1" }) });

    const result = await getAllSessionsUseCase.execute("u1");

    expect(result.length).toBe(1);
  });
});
