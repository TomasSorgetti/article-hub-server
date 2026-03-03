import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import GetMySubscriptionUseCase from "../../../src/application/subscription/getMySubscription.usecase.js";
import { NotFoundError } from "../../../src/domain/errors/index.js";

describe("GetMySubscriptionUseCase", () => {
  let subscriptionRepository;
  let getMySubscriptionUseCase;

  beforeEach(() => {
    subscriptionRepository = { findByUserId: jest.fn() };
    getMySubscriptionUseCase = new GetMySubscriptionUseCase({
      subscriptionRepository,
    });
  });

  it("should throw NotFoundError if no subscription", async () => {
    subscriptionRepository.findByUserId.mockResolvedValue(null);
    await expect(getMySubscriptionUseCase.execute("u1")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should return subscription if found", async () => {
    subscriptionRepository.findByUserId.mockResolvedValue({ id: "s1" });
    const result = await getMySubscriptionUseCase.execute("u1");
    expect(result.id).toBe("s1");
    expect(subscriptionRepository.findByUserId).toHaveBeenCalledWith("u1");
  });
});
