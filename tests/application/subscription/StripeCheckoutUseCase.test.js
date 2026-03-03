import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import StripeCheckoutUseCase from "../../../src/application/subscription/stripeCheckout.usecase.js";

describe("StripeCheckoutUseCase", () => {
  let planRepository, userRepository, stripeService, env;
  let stripeCheckoutUseCase;

  beforeEach(() => {
    planRepository = { getStripePriceId: jest.fn() };
    userRepository = { findById: jest.fn(), update: jest.fn() };
    stripeService = {
      createCustomer: jest.fn(),
      createCheckoutSession: jest.fn(),
    };
    env = { FRONT_URL: "http://test.com" };

    stripeCheckoutUseCase = new StripeCheckoutUseCase({
      planRepository,
      userRepository,
      stripeService,
      env,
    });
  });

  it("should successfully create checkout session", async () => {
    userRepository.findById.mockResolvedValue({
      email: "t@t.com",
      stripeCustomerId: "c1",
    });
    planRepository.getStripePriceId.mockResolvedValue("price_123");
    stripeService.createCheckoutSession.mockResolvedValue({
      url: "http://stripe.com",
    });

    const result = await stripeCheckoutUseCase.execute({
      userId: "u1",
      planId: "p1",
    });

    expect(result.url).toBe("http://stripe.com");
    expect(stripeService.createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "c1",
        priceId: "price_123",
      }),
    );
  });
});
