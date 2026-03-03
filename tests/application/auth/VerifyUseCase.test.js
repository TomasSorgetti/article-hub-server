import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import VerifyUseCase from "../../../src/application/auth/verify.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("VerifyUseCase", () => {
  let userRepository, jwtService;
  let verifyUseCase;

  beforeEach(() => {
    userRepository = { findById: jest.fn(), update: jest.fn() };
    jwtService = { verifyCode: jest.fn() };

    verifyUseCase = new VerifyUseCase({
      userRepository,
      jwtService,
    });
  });

  it("should successfully verify user", async () => {
    jwtService.verifyCode.mockReturnValue({ userId: "u1" });
    userRepository.findById.mockResolvedValue({
      _id: "u1",
      verificationToken: "token",
      verificationTokenExpires: new Date(Date.now() + 100000),
    });

    await verifyUseCase.execute("token");

    expect(userRepository.update).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({ isVerified: true }),
    );
  });
});
