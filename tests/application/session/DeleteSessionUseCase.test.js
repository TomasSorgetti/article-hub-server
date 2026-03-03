import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import DeleteSessionUseCase from "../../../src/application/session/delete.usecase.js";

describe("DeleteSessionUseCase", () => {
  let sessionRepository;
  let deleteSessionUseCase;

  beforeEach(() => {
    sessionRepository = { deleteById: jest.fn() };
    deleteSessionUseCase = new DeleteSessionUseCase({ sessionRepository });
  });

  it("should successfully delete a session", async () => {
    sessionRepository.deleteById.mockResolvedValue({ id: "s1" });
    const result = await deleteSessionUseCase.execute("s1");
    expect(result.id).toBe("s1");
    expect(sessionRepository.deleteById).toHaveBeenCalledWith("s1");
  });
});
