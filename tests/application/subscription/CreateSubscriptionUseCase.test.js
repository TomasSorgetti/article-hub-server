import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import CreateSubscriptionUseCase from "../../../src/application/subscription/createSubscription.usecase.js";

describe("CreateSubscriptionUseCase", () => {
  let subscriptionRepository, userRepository, stripeService;
  let createSubscriptionUseCase;

  beforeEach(() => {
    subscriptionRepository = { createOrUpdate: jest.fn() };
    userRepository = { findById: jest.fn(), update: jest.fn() };
    stripeService = {
      createCustomer: jest.fn(),
      createSubscription: jest.fn(),
    };
    createSubscriptionUseCase = new CreateSubscriptionUseCase({
      subscriptionRepository,
      userRepository,
      stripeService,
    });
  });

  it("should successfully create a subscription", async () => {
    userRepository.findById.mockResolvedValue({ stripeCustomerId: "c1" });
    stripeService.createSubscription.mockResolvedValue({
      id: "s1",
      status: "active",
    });

    const result = await createSubscriptionUseCase.execute({
      userId: "u1",
      email: "t@t.com",
      planPriceId: "p1",
    });

    expect(result.id).toBe("s1");
    expect(subscriptionRepository.createOrUpdate).toHaveBeenCalled();
  });

  it("should create customer if not exists", async () => {
    userRepository.findById.mockResolvedValue({ stripeCustomerId: null });
    stripeService.createCustomer.mockResolvedValue({ id: "c1" });
    stripeService.createSubscription.mockResolvedValue({
      id: "s1",
      status: "active",
    });

    await createSubscriptionUseCase.execute({
      userId: "u1",
      email: "t@t.com",
      planPriceId: "p1",
    });

    expect(stripeService.createCustomer).toHaveBeenCalledWith("t@t.com");
    expect(userRepository.update).toHaveBeenCalledWith("u1", {
      stripeCustomerId: "c1",
    });
  });
});
