import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetProfileUseCase from "../../../src/application/user/profile.usecase.js";

describe("GetProfileUseCase", () => {
  let userRepository, userFactory;
  let getProfileUseCase;

  beforeEach(() => {
    userRepository = { findById: jest.fn() };
    userFactory = { create: jest.fn() };
    getProfileUseCase = new GetProfileUseCase({ userRepository, userFactory });
  });

  it("should successfully return profile", async () => {
    userRepository.findById.mockResolvedValue({ id: "u1" });
    userFactory.create.mockReturnValue({
      sanitized: () => ({ username: "u1" }),
    });

    const result = await getProfileUseCase.execute("u1");

    expect(result.username).toBe("u1");
  });
});
