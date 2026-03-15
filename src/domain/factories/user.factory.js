import UserEntity from "../entities/user.entity.js";

export default class UserFactory {
  create({
    _id,
    id,
    username,
    email,
    password = null,
    role = "user",
    avatar = null,
    isVerified = false,
    preferences = {},
    subscription = null,
    sessions = [],
    workbenches = [],
  }) {
    return new UserEntity({
      id: _id || id,
      username,
      email,
      password,
      role,
      avatar,
      isVerified,
      preferences: {
        language: preferences.language || "en",
        notifications: {
          email: {
            marketing: preferences.notifications?.email?.marketing ?? false,
            productUpdates:
              preferences.notifications?.email?.productUpdates ?? true,
            activity: preferences.notifications?.email?.activity ?? true,
          },
          push: preferences.notifications?.push ?? false,
        },
      },
      subscription,
      sessions,
      workbenches,
    });
  }

  createAdmin({ _id, id, username, email, password, avatar = null }) {
    return new UserEntity({
      id: _id || id,
      username,
      email,
      password,
      avatar,
      role: "admin",
      isVerified: true,
    });
  }

  createWithOAuth({
    _id,
    id,
    username,
    email,
    provider,
    providerId,
    avatar = null,
  }) {
    const user = new UserEntity({
      id: _id || id,
      username,
      email,
      avatar,
      role: "user",
      isVerified: true,
      loginMethods: [
        {
          provider,
          providerId,
          addedAt: new Date(),
        },
      ],
    });

    return user;
  }

  validateUpdate(data) {
    return UserEntity.validateUpdate(data);
  }
}
