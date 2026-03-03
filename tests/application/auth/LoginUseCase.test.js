import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import LoginUseCase from "../../../src/application/auth/login.usecase.js";
import {
  NotFoundError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "../../../src/domain/errors/index.js";

describe("LoginUseCase", () => {
  let userRepository,
    sessionRepository,
    jwtService,
    hashService,
    userFactory,
    sessionFactory;
  let loginUseCase;

  beforeEach(() => {
    userRepository = { findByEmail: jest.fn(), update: jest.fn() };
    sessionRepository = { create: jest.fn() };
    jwtService = {
      signRefresh: jest.fn(),
      verifyRefresh: jest.fn(),
      signAccess: jest.fn(),
    };
    hashService = { verify: jest.fn(), hash: jest.fn() };
    userFactory = { create: jest.fn() };
    sessionFactory = { create: jest.fn() };

    loginUseCase = new LoginUseCase({
      userRepository,
      sessionRepository,
      jwtService,
      hashService,
      userFactory,
      sessionFactory,
    });
  });

  it("should throw NotFoundError if user not found", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    await expect(
      loginUseCase.execute({ email: "test@test.com" }),
    ).rejects.toThrow(NotFoundError);
  });

  it("should throw UnauthorizedError if user not verified", async () => {
    userRepository.findByEmail.mockResolvedValue({
      email: "t@t.com",
      isVerified: false,
    });
    userFactory.create.mockReturnValue({ isVerified: false });
    await expect(loginUseCase.execute({ email: "t@t.com" })).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw InvalidCredentialsError if password invalid", async () => {
    userRepository.findByEmail.mockResolvedValue({
      email: "t@t.com",
      isVerified: true,
      loginMethods: [{ provider: "email" }],
    });
    userFactory.create.mockReturnValue({
      isVerified: true,
      password: "hashed",
    });
    hashService.verify.mockResolvedValue(false);

    await expect(
      loginUseCase.execute({ email: "t@t.com", password: "wrong" }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it("should return tokens on success", async () => {
    userRepository.findByEmail.mockResolvedValue({
      _id: "u1",
      email: "t@t.com",
      isVerified: true,
      loginMethods: [{ provider: "email" }],
    });
    const mockUserEntity = {
      id: "u1",
      isVerified: true,
      password: "hashed",
      sanitized: jest.fn().mockReturnValue({ id: "u1" }),
    };
    userFactory.create.mockReturnValue(mockUserEntity);
    hashService.verify.mockResolvedValue(true);
    jwtService.signRefresh.mockReturnValue("rt");
    jwtService.verifyRefresh.mockReturnValue({ exp: 123 });
    hashService.hash.mockResolvedValue("hashed_rt");
    sessionFactory.create.mockReturnValue({
      toObject: jest.fn().mockReturnValue({}),
    });
    sessionRepository.create.mockResolvedValue({ _id: "s1" });
    jwtService.signAccess.mockReturnValue("at");

    const result = await loginUseCase.execute({
      email: "t@t.com",
      password: "pass",
    });

    expect(result.accessToken).toBe("at");
    expect(result.refreshToken).toBe("rt");
  });
});
