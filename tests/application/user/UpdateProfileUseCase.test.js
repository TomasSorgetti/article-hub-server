import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UpdateProfileUseCase from "../../../src/application/user/update.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("UpdateProfileUseCase", () => {
  let userRepository, storageService, userFactory;
  let updateProfileUseCase;

  beforeEach(() => {
    userRepository = { findById: jest.fn(), update: jest.fn() };
    storageService = { uploadFile: jest.fn(), deleteFile: jest.fn() };
    userFactory = { validateUpdate: jest.fn(), create: jest.fn() };

    updateProfileUseCase = new UpdateProfileUseCase({
      userRepository,
      storageService,
      userFactory,
    });
  });

  it("should throw NotFoundError if user missing", async () => {
    userRepository.findById.mockResolvedValue(null);
    await expect(updateProfileUseCase.execute("u1", {})).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should successfully update profile", async () => {
    userRepository.findById.mockResolvedValue({ id: "u1", avatar: "old.jpg" });
    userFactory.validateUpdate.mockReturnValue({ username: "new" });
    userRepository.update.mockResolvedValue({
      id: "u1",
      username: "new",
      avatar: "old.jpg",
    });
    userFactory.create.mockReturnValue({
      sanitized: jest.fn().mockReturnValue({ username: "new" }),
    });

    const result = await updateProfileUseCase.execute("u1", {
      username: "new",
    });

    expect(result.username).toBe("new");
    expect(userRepository.update).toHaveBeenCalled();
  });
});
