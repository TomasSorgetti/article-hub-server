import { describe, it, expect } from "@jest/globals";
import UserEntity from "../../../src/domain/entities/user.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("UserEntity", () => {
  const fullUserData = {
    _id: "user123",
    username: "johndoe",
    email: "john@example.com",
    password: "hashedpassword",
    role: "admin",
    isVerified: true,
    verificationToken: "token123",
    verificationTokenExpires: new Date(),
    preferences: { theme: "dark", notifications: false },
  };

  it("should create a valid user with all fields", () => {
    const user = new UserEntity(fullUserData);

    expect(user.id).toBe(fullUserData._id);
    expect(user.username).toBe(fullUserData.username);
    expect(user.email).toBe(fullUserData.email);
    expect(user.password).toBe(fullUserData.password);
    expect(user.role).toBe(fullUserData.role);
    expect(user.isVerified).toBe(fullUserData.isVerified);
    expect(user.preferences).toEqual(fullUserData.preferences);
  });

  it("should create a user with default values", () => {
    const user = new UserEntity({ username: "test", email: "test@test.com" });

    expect(user.role).toBe("user");
    expect(user.isVerified).toBe(false);
    expect(user.preferences.theme).toBe("light");
  });

  it("should return sanitized data without sensitive fields", () => {
    const user = new UserEntity(fullUserData);
    const sanitized = user.sanitized();

    expect(sanitized.password).toBeUndefined();
    expect(sanitized.verificationToken).toBeUndefined();
    expect(sanitized.username).toBe(fullUserData.username);
  });

  describe("validateUpdate", () => {
    it("should return only allowed fields", () => {
      const updateData = {
        username: "newnick",
        email: "hack@hack.com",
        role: "admin",
      };
      const validated = UserEntity.validateUpdate(updateData);

      expect(validated.username).toBe("newnick");
      expect(validated.email).toBeUndefined();
      expect(validated.role).toBeUndefined();
    });

    it("should throw InvalidInputError if username is too short", () => {
      expect(() => UserEntity.validateUpdate({ username: "ab" })).toThrow(
        InvalidInputError,
      );
    });
  });

  it("should manage login methods correctly", () => {
    const user = new UserEntity(fullUserData);
    expect(user.hasLoginMethod("google")).toBe(false);

    user.addLoginMethod({ provider: "google", providerId: "g123" });
    expect(user.hasLoginMethod("google")).toBe(true);
  });
});
