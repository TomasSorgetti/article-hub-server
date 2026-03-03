import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import RegisterUseCase from "../../../src/application/auth/register.usecase.js";
import { AlreadyExistsError } from "../../../src/domain/errors/index.js";

describe("RegisterUseCase", () => {
  let userRepository,
    subscriptionRepository,
    planRepository,
    workbenchRepository;
  let hashService,
    jwtService,
    emailService,
    emailQueueService,
    userFactory,
    subscriptionFactory,
    workbenchFactory,
    env;
  let registerUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    subscriptionRepository = { create: jest.fn() };
    planRepository = { findByName: jest.fn() };
    workbenchRepository = { create: jest.fn() };
    hashService = { hash: jest.fn() };
    jwtService = { signCode: jest.fn() };
    emailService = {};
    emailQueueService = { addJob: jest.fn() };
    userFactory = { create: jest.fn() };
    subscriptionFactory = { create: jest.fn() };
    workbenchFactory = { create: jest.fn() };
    env = { FRONT_URL: "http://test.com" };

    registerUseCase = new RegisterUseCase({
      userRepository,
      subscriptionRepository,
      planRepository,
      workbenchRepository,
      hashService,
      jwtService,
      emailService,
      emailQueueService,
      userFactory,
      subscriptionFactory,
      workbenchFactory,
      env,
    });
  });

  it("should throw AlreadyExistsError if user exists", async () => {
    userRepository.findByEmail.mockResolvedValue({ id: "u1" });
    await expect(registerUseCase.execute({ email: "t@t.com" })).rejects.toThrow(
      AlreadyExistsError,
    );
  });

  it("should successfully register", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue("hashed");
    const mockUserEntity = {
      id: "u1",
      addLoginMethod: jest.fn(),
      toObject: jest.fn().mockReturnValue({ username: "u1" }),
      sanitized: jest.fn().mockReturnValue({ username: "u1" }),
    };
    userFactory.create.mockReturnValue(mockUserEntity);
    userRepository.create.mockResolvedValue({
      _id: "u1",
      email: "t@t.com",
      username: "u1",
    });
    planRepository.findByName.mockResolvedValue({ _id: "p1" });
    jwtService.signCode.mockReturnValue("token");
    subscriptionFactory.create.mockReturnValue({
      toObject: jest.fn().mockReturnValue({}),
    });
    subscriptionRepository.create.mockResolvedValue({ _id: "s1" });
    workbenchFactory.create.mockReturnValue({
      toObject: jest.fn().mockReturnValue({}),
    });

    const result = await registerUseCase.execute({
      username: "u1",
      email: "t@t.com",
      password: "p1",
    });

    expect(result.username).toBe("u1");
    expect(userRepository.create).toHaveBeenCalled();
    expect(emailQueueService.addJob).toHaveBeenCalled();
  });
});
