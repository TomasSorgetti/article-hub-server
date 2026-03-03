import { describe, it, expect } from "@jest/globals";
import SessionEntity from "../../../src/domain/entities/session.entity.js";

describe("SessionEntity", () => {
  const sessionData = {
    userId: "user123",
    refreshToken: "refresh123",
    userAgent: "Mozilla/5.0",
    ip: "127.0.0.1",
    expiresAt: new Date(Date.now() + 10000),
    isValid: true,
  };

  it("should create a valid session", () => {
    const session = new SessionEntity(sessionData);

    expect(session.userId).toBe(sessionData.userId);
    expect(session.refreshToken).toBe(sessionData.refreshToken);
    expect(session.isValid).toBe(true);
    expect(session.createdAt).toBeInstanceOf(Date);
  });

  it("should return sanitized data without refreshToken", () => {
    const session = new SessionEntity(sessionData);
    const sanitized = session.sanitized();

    expect(sanitized.refreshToken).toBeUndefined();
    expect(sanitized.userId).toBe(sessionData.userId);
  });

  it("should return all object fields in toObject", () => {
    const session = new SessionEntity(sessionData);
    const obj = session.toObject();

    expect(obj.refreshToken).toBe(sessionData.refreshToken);
    expect(obj.userId).toBe(sessionData.userId);
  });
});
