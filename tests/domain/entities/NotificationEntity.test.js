import { describe, it, expect } from "@jest/globals";
import NotificationEntity from "../../../src/domain/entities/notification.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("NotificationEntity", () => {
  const validNotificationData = {
    userId: "user123",
    type: "activity",
    message: "New message received",
    read: false,
    link: "/messages/1",
  };

  it("should create a valid notification", () => {
    const notification = new NotificationEntity(validNotificationData);

    expect(notification.userId).toBe(validNotificationData.userId);
    expect(notification.type).toBe(validNotificationData.type);
    expect(notification.message).toBe(validNotificationData.message);
    expect(notification.read).toBe(validNotificationData.read);
  });

  it("should throw error if userId is missing", () => {
    const { userId, ...dataWithoutUser } = validNotificationData;
    expect(() => new NotificationEntity(dataWithoutUser)).toThrow(
      InvalidInputError,
    );
  });

  it("should throw error if type is invalid", () => {
    expect(
      () =>
        new NotificationEntity({ ...validNotificationData, type: "invalid" }),
    ).toThrow(InvalidInputError);
  });

  it("should return a plain object via toObject()", () => {
    const notification = new NotificationEntity(validNotificationData);
    const obj = notification.toObject();

    expect(obj).toEqual(validNotificationData);
  });
});
