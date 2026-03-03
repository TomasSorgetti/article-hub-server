import { InvalidInputError } from "../errors/index.js";

export default class SubscriptionEntity {
  #id;
  #userId;
  #planId;
  #status;
  #startedAt;
  #expiresAt;
  #createdAt;

  constructor({
    id = null,
    userId = null,
    planId = null,
    status = "active",
    startedAt = new Date(),
    expiresAt = null,
    createdAt = new Date(),
  }) {
    if (!userId)
      throw new InvalidInputError("User ID is required for subscription");

    this.#id = id;
    this.#userId = userId;
    this.#planId = planId;
    this.#status = status;
    this.#startedAt = startedAt;
    this.#expiresAt = expiresAt;
    this.#createdAt = createdAt;
  }

  get id() {
    return this.#id;
  }
  get userId() {
    return this.#userId;
  }
  get planId() {
    return this.#planId;
  }
  get status() {
    return this.#status;
  }
  get startedAt() {
    return this.#startedAt;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get createdAt() {
    return this.#createdAt;
  }

  set status(newStatus) {
    if (!["active", "canceled", "expired"].includes(newStatus)) {
      throw new InvalidInputError("Invalid subscription status");
    }
    this.#status = newStatus;
  }

  toObject() {
    return {
      userId: this.#userId,
      planId: this.#planId,
      status: this.#status,
      startedAt: this.#startedAt,
      expiresAt: this.#expiresAt,
      createdAt: this.#createdAt,
    };
  }
}
