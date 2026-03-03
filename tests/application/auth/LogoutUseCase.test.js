import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import LogoutUseCase from "../../../src/application/auth/logout.usecase.js";

describe("LogoutUseCase", () => {
  let sessionRepository;
  let logoutUseCase;

  beforeEach(() => {
    sessionRepository = { deleteById: jest.fn() };
    logoutUseCase = new LogoutUseCase({ sessionRepository });
  });

  it("should successfully log out", async () => {
    sessionRepository.deleteById.mockResolvedValue({ id: "s1" });

    await logoutUseCase.execute({ sessionId: "s1" });

    expect(sessionRepository.deleteById).toHaveBeenCalledWith("s1");
  });
});
