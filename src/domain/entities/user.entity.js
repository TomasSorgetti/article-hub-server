import { InvalidInputError } from "../errors/index.js";
import ERROR_CODES from "../errors/errorCodes.js";

export default class UserEntity {
  #id;
  #username;
  #email;
  #password;
  #role;
  #isVerified;
  #verificationToken;
  #verificationTokenExpires;
  #loginMethods;
  #sessions;
  #workbenches;
  #avatar;
  #subscription;
  #preferences;
  #deletedAt;
  #lastLogin;
  #createdAt;

  constructor(data = {}) {
    this.#id = data._id || data.id;
    this.#username = data.username;
    this.#email = data.email;
    this.#password = data.password;
    this.#role = data.role || "user";
    this.#isVerified = data.isVerified || false;
    this.#verificationToken = data.verificationToken;
    this.#verificationTokenExpires = data.verificationTokenExpires;
    this.#loginMethods = data.loginMethods || [];
    this.#sessions = data.sessions || [];
    this.#workbenches = data.workbenches || [];
    this.#avatar = data.avatar;
    this.#subscription = data.subscription;
    this.#preferences = data.preferences || {
      theme: "light",
      notifications: true,
    };
    this.#deletedAt = data.deletedAt;
    this.#lastLogin = data.lastLogin;
    this.#createdAt = data.createdAt || new Date();
  }

  get id() {
    return this.#id;
  }
  get username() {
    return this.#username;
  }
  get email() {
    return this.#email;
  }
  get password() {
    return this.#password;
  }
  get role() {
    return this.#role;
  }
  get isVerified() {
    return this.#isVerified;
  }
  get verificationToken() {
    return this.#verificationToken;
  }
  get verificationTokenExpires() {
    return this.#verificationTokenExpires;
  }
  get loginMethods() {
    return [...this.#loginMethods];
  }
  get avatar() {
    return this.#avatar;
  }
  get subscription() {
    return this.#subscription;
  }
  get preferences() {
    return { ...this.#preferences };
  }
  get deletedAt() {
    return this.#deletedAt;
  }

  sanitized() {
    const {
      password,
      verificationToken,
      verificationTokenExpires,
      ...safeUser
    } = this.toObject();
    return safeUser;
  }

  toObject() {
    return {
      id: this.#id,
      username: this.#username,
      email: this.#email,
      password: this.#password,
      role: this.#role,
      isVerified: this.#isVerified,
      verificationToken: this.#verificationToken,
      verificationTokenExpires: this.#verificationTokenExpires,
      loginMethods: this.#loginMethods,
      sessions: this.#sessions,
      workbenches: this.#workbenches,
      avatar: this.#avatar,
      subscription: this.#subscription,
      preferences: this.#preferences,
      deletedAt: this.#deletedAt,
      lastLogin: this.#lastLogin,
      createdAt: this.#createdAt,
    };
  }

  static validateUpdate(data) {
    const allowedFields = ["username"];
    const validatedData = {};

    for (const key of Object.keys(data)) {
      if (allowedFields.includes(key)) {
        validatedData[key] = data[key];
      }
    }

    if (validatedData.username && validatedData.username.length < 3) {
      throw new InvalidInputError("Username must be at least 3 characters", {
        field: "username",
        code: ERROR_CODES.VALIDATION.INVALID_INPUT,
      });
    }

    return validatedData;
  }

  addLoginMethod(method) {
    this.#loginMethods.push(method);
  }

  hasLoginMethod(provider) {
    return this.#loginMethods.some((m) => m.provider === provider);
  }
}
