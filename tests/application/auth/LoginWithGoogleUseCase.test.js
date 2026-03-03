import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import LoginWithGoogleUseCase from "../../../src/application/auth/loginWithGoogle.usecase.js";
import { UnauthorizedError } from "../../../src/domain/errors/index.js";

describe("LoginWithGoogleUseCase", () => {
  let googleStrategy,
    userRepository,
    sessionRepository,
    jwtService,
    hashService,
    notificationRepository,
    socketService,
    userFactory,
    sessionFactory,
    notificationFactory;
  let loginWithGoogleUseCase;

  beforeEach(() => {
    googleStrategy = { verify: jest.fn() };
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    sessionRepository = { create: jest.fn() };
    jwtService = {
      signRefresh: jest.fn(),
      verifyRefresh: jest.fn(),
      signAccess: jest.fn(),
    };
    hashService = { hash: jest.fn() };
    notificationRepository = { create: jest.fn() };
    socketService = { sendNotification: jest.fn() };
    userFactory = { create: jest.fn(), createWithOAuth: jest.fn() };
    sessionFactory = { create: jest.fn() };
    notificationFactory = { create: jest.fn() };

    loginWithGoogleUseCase = new LoginWithGoogleUseCase({
      googleStrategy,
      userRepository,
      sessionRepository,
      jwtService,
      hashService,
      notificationRepository,
      socketService,
      userFactory,
      sessionFactory,
      notificationFactory,
    });
  });

  it("should successfully log in with Google", async () => {
    googleStrategy.verify.mockResolvedValue({
      email: "t@g.com",
      emailVerified: true,
      id: "g1",
      displayName: "T",
    });
    userRepository.findByEmail.mockResolvedValue({
      _id: "u1",
      loginMethods: [{ provider: "google" }],
    });
    userFactory.create.mockReturnValue({
      id: "u1",
      hasLoginMethod: () => true,
      sanitized: () => ({ id: "u1" }),
    });
    jwtService.signRefresh.mockReturnValue("rt");
    jwtService.verifyRefresh.mockReturnValue({ exp: 123 });
    hashService.hash.mockResolvedValue("hrt");
    sessionFactory.create.mockReturnValue({ toObject: () => ({}) });
    sessionRepository.create.mockResolvedValue({ _id: "s1" });
    jwtService.signAccess.mockReturnValue("at");

    const result = await loginWithGoogleUseCase.execute({ idToken: "token" });

    expect(result.accessToken).toBe("at");
  });
});
