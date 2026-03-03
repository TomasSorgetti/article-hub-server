import SessionEntity from "../entities/session.entity.js";

export default class SessionFactory {
  create({
    userId,
    refreshToken,
    userAgent,
    ip,
    expiresInDays = 7,
    expiresAt,
  }) {
    const finalExpiresAt =
      expiresAt || new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

    return new SessionEntity({
      userId,
      refreshToken,
      userAgent,
      ip,
      expiresAt: finalExpiresAt,
    });
  }
}
