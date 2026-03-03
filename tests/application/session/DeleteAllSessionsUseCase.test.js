import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteAllSessionsUseCase from "../../../src/application/session/deleteAll.usecase.js";

describe("DeleteAllSessionsUseCase", () => {
  let sessionRepository;
  let deleteAllSessionsUseCase;

  beforeEach(() => {
    sessionRepository = { deleteByUserId: jest.fn() };
    deleteAllSessionsUseCase = new DeleteAllSessionsUseCase({
      sessionRepository,
    });
  });

  it("should successfully delete all sessions for a user", async () => {
    sessionRepository.deleteByUserId.mockResolvedValue({ acknowledged: true });
    const result = await deleteAllSessionsUseCase.execute("u1");
    expect(result.acknowledged).toBe(true);
    expect(sessionRepository.deleteByUserId).toHaveBeenCalledWith("u1");
  });
});
