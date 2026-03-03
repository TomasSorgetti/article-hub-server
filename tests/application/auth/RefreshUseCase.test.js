import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import RefreshUseCase from "../../../src/application/auth/refresh.usecase.js";
import { UnauthorizedError } from "../../../src/domain/errors/index.js";

describe("RefreshUseCase", () => {
  let sessionRepository, jwtService, hashService;
  let refreshUseCase;

  beforeEach(() => {
    sessionRepository = { findByUserId: jest.fn(), update: jest.fn() };
    jwtService = {
      verifyRefresh: jest.fn(),
      signAccess: jest.fn(),
      signRefresh: jest.fn(),
    };
    hashService = { verify: jest.fn(), hash: jest.fn() };

    refreshUseCase = new RefreshUseCase({
      sessionRepository,
      jwtService,
      hashService,
    });
  });

  it("should successfully refresh tokens", async () => {
    jwtService.verifyRefresh.mockReturnValue({
      userId: "u1",
      rememberMe: true,
    });
    sessionRepository.findByUserId.mockResolvedValue([
      { _id: "s1", refreshToken: "hrt" },
    ]);
    hashService.verify.mockResolvedValue(true);
    jwtService.signAccess.mockReturnValue("new_at");
    jwtService.signRefresh.mockReturnValue("new_rt");
    hashService.hash.mockResolvedValue("new_hrt");

    const result = await refreshUseCase.execute("old_rt");

    expect(result.newAccesToken).toBe("new_at");
    expect(sessionRepository.update).toHaveBeenCalled();
  });
});
