import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import StripeVerifySessionUseCase from "../../../src/application/subscription/verifyStripeSession.usecase.js";

describe("StripeVerifySessionUseCase", () => {
  let stripeService, subscriptionRepository;
  let stripeVerifySessionUseCase;

  beforeEach(() => {
    stripeService = { retrieveCheckoutSession: jest.fn() };
    subscriptionRepository = {
      findByUserId: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };
    stripeVerifySessionUseCase = new StripeVerifySessionUseCase({
      stripeService,
      subscriptionRepository,
    });
  });

  it("should successfully verify session and update subscription", async () => {
    stripeService.retrieveCheckoutSession.mockResolvedValue({
      payment_status: "paid",
      id: "sess_1",
      metadata: { planId: "p1" },
    });
    subscriptionRepository.findByUserId.mockResolvedValue({ _id: "sub_1" });
    subscriptionRepository.update.mockResolvedValue({
      id: "sub_1",
      status: "active",
    });

    const result = await stripeVerifySessionUseCase.execute({
      userId: "u1",
      sessionId: "sess_1",
    });

    expect(result.subscription.status).toBe("active");
    expect(subscriptionRepository.update).toHaveBeenCalled();
  });

  it("should create subscription if not exists", async () => {
    stripeService.retrieveCheckoutSession.mockResolvedValue({
      payment_status: "paid",
      id: "sess_1",
      metadata: { planId: "p1" },
    });
    subscriptionRepository.findByUserId.mockRejectedValue(
      new Error("Not found"),
    );
    subscriptionRepository.create.mockResolvedValue({
      id: "sub_new",
      status: "active",
    });

    const result = await stripeVerifySessionUseCase.execute({
      userId: "u1",
      sessionId: "sess_1",
    });

    expect(result.subscription.id).toBe("sub_new");
    expect(subscriptionRepository.create).toHaveBeenCalled();
  });

  it("should throw error if payment not completed", async () => {
    stripeService.retrieveCheckoutSession.mockResolvedValue({
      payment_status: "unpaid",
    });
    await expect(
      stripeVerifySessionUseCase.execute({ userId: "u1", sessionId: "sess_1" }),
    ).rejects.toThrow("Payment not completed");
  });
});
