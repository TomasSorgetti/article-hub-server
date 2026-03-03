import { NotFoundError, UnauthorizedError } from "../../domain/errors/index.js";

export default class LoginWithGoogleUseCase {
  #userRepository;
  #sessionRepository;
  #jwtService;
  #hashService;
  #googleStrategy;
  #notificationRepository;
  #socketService;
  #userFactory;
  #sessionFactory;
  #notificationFactory;

  constructor({
    userRepository,
    sessionRepository,
    jwtService,
    hashService,
    googleStrategy,
    notificationRepository,
    socketService,
    userFactory,
    sessionFactory,
    notificationFactory,
  }) {
    this.#userRepository = userRepository;
    this.#sessionRepository = sessionRepository;
    this.#jwtService = jwtService;
    this.#hashService = hashService;
    this.#googleStrategy = googleStrategy;
    this.#notificationRepository = notificationRepository;
    this.#socketService = socketService;
    this.#userFactory = userFactory;
    this.#sessionFactory = sessionFactory;
    this.#notificationFactory = notificationFactory;
  }

  async execute({ idToken, rememberme, userAgent, ip }) {
    const profile = await this.#googleStrategy.verify(idToken);

    if (!profile.emailVerified) {
      throw new UnauthorizedError("Google account not verified");
    }

    let userFound = await this.#userRepository.findByEmail(profile.email);

    if (!userFound) {
      const newUserEntity = this.#userFactory.createWithOAuth({
        username: profile.name.replace(/\s+/g, "").toLowerCase(),
        email: profile.email,
        avatar: profile.avatar,
        provider: "google",
        providerId: profile.providerId,
      });

      userFound = await this.#userRepository.create(newUserEntity.toObject());
    } else {
      const userEntity = this.#userFactory.create(userFound);
      const hasGoogleLogin = userEntity.hasLoginMethod("google");

      if (!hasGoogleLogin) {
        userEntity.addLoginMethod({
          provider: "google",
          providerId: profile.providerId,
          addedAt: new Date(),
        });

        const updateData = {
          loginMethods: userEntity.loginMethods,
        };

        if (!userEntity.avatar) {
          updateData.avatar = profile.avatar;
        }

        userFound = await this.#userRepository.update(
          userFound._id || userFound.id,
          updateData,
        );

        const notificationEntity = this.#notificationFactory.create({
          userId: userFound._id || userFound.id,
          type: "activity",
          message: `You have added Google as a login method.`,
        });

        try {
          const notification = await this.#notificationRepository.create(
            notificationEntity.toObject(),
          );
          this.#socketService.sendNotification(
            userFound._id || userFound.id,
            notification,
          );
        } catch (err) {
          console.error("Failed to send notification:", err);
        }
      }
    }

    const user = this.#userFactory.create(userFound);

    const refreshToken = this.#jwtService.signRefresh(user.id, rememberme);
    const { exp } = this.#jwtService.verifyRefresh(refreshToken);
    const expiresAt = new Date(exp * 1000);

    const hashedRefreshToken = await this.#hashService.hash(refreshToken);

    const sessionEntity = this.#sessionFactory.create({
      userId: user.id,
      refreshToken: hashedRefreshToken,
      userAgent,
      ip,
      expiresAt,
    });

    const newSession = await this.#sessionRepository.create(
      sessionEntity.toObject(),
    );

    const accessToken = this.#jwtService.signAccess(
      user.id,
      newSession._id.toString(),
      rememberme,
    );

    await this.#userRepository.update(user.id, { lastLogin: new Date() });

    return {
      accessToken,
      refreshToken,
      user: user.sanitized(),
      sessionId: newSession._id,
    };
  }
}
