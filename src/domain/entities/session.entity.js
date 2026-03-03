export default class SessionEntity {
  #userId;
  #refreshToken;
  #userAgent;
  #ip;
  #expiresAt;
  #isValid;
  #createdAt;

  constructor({
    userId,
    refreshToken,
    userAgent,
    ip,
    expiresAt,
    isValid = true,
  }) {
    this.#userId = userId;
    this.#refreshToken = refreshToken;
    this.#userAgent = userAgent;
    this.#ip = ip;
    this.#expiresAt = expiresAt;
    this.#isValid = isValid;
    this.#createdAt = new Date();
  }

  get userId() {
    return this.#userId;
  }
  get refreshToken() {
    return this.#refreshToken;
  }
  get userAgent() {
    return this.#userAgent;
  }
  get ip() {
    return this.#ip;
  }
  get expiresAt() {
    return this.#expiresAt;
  }
  get isValid() {
    return this.#isValid;
  }
  get createdAt() {
    return this.#createdAt;
  }

  sanitized() {
    return {
      userId: this.#userId,
      userAgent: this.#userAgent,
      ip: this.#ip,
      expiresAt: this.#expiresAt,
      isValid: this.#isValid,
      createdAt: this.#createdAt,
    };
  }

  toObject() {
    return {
      userId: this.#userId,
      refreshToken: this.#refreshToken,
      userAgent: this.#userAgent,
      ip: this.#ip,
      expiresAt: this.#expiresAt,
      isValid: this.#isValid,
      createdAt: this.#createdAt,
    };
  }
}
