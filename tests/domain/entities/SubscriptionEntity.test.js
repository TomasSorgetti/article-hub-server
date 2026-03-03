import { describe, it, expect } from "@jest/globals";
import SubscriptionEntity from "../../../src/domain/entities/subscription.entity.js";
import { InvalidInputError } from "../../../src/domain/errors/index.js";

describe("SubscriptionEntity", () => {
  const validSubscriptionData = {
    id: "sub123",
    userId: "user123",
    planId: "plan456",
    status: "active",
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 100000),
  };

  it("should create a valid subscription", () => {
    const subscription = new SubscriptionEntity(validSubscriptionData);

    expect(subscription.userId).toBe(validSubscriptionData.userId);
    expect(subscription.planId).toBe(validSubscriptionData.planId);
    expect(subscription.status).toBe(validSubscriptionData.status);
  });

  it("should throw error if userId is missing", () => {
    const { userId, ...dataWithoutUser } = validSubscriptionData;
    expect(() => new SubscriptionEntity(dataWithoutUser)).toThrow(
      InvalidInputError,
    );
  });

  it("should allow updating status to a valid value", () => {
    const subscription = new SubscriptionEntity(validSubscriptionData);
    subscription.status = "canceled";
    expect(subscription.status).toBe("canceled");
  });

  it("should throw error when updating to an invalid status", () => {
    const subscription = new SubscriptionEntity(validSubscriptionData);
    expect(() => {
      subscription.status = "invalid";
    }).toThrow(InvalidInputError);
  });

  it("should return a plain object via toObject()", () => {
    const subscription = new SubscriptionEntity(validSubscriptionData);
    const obj = subscription.toObject();

    expect(obj.userId).toBe(validSubscriptionData.userId);
    expect(obj.planId).toBe(validSubscriptionData.planId);
  });
});
