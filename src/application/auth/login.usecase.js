import {
  NotFoundError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "../../domain/errors/index.js";

export default class LoginUseCase {
  #userRepository;
  #sessionRepository;
  #jwtService;
  #hashService;
  #userFactory;
  #sessionFactory;

  constructor({
    userRepository,
    sessionRepository,
    jwtService,
    hashService,
    userFactory,
    sessionFactory,
  }) {
    this.#userRepository = userRepository;
    this.#sessionRepository = sessionRepository;
    this.#jwtService = jwtService;
    this.#hashService = hashService;
    this.#userFactory = userFactory;
    this.#sessionFactory = sessionFactory;
  }

  async execute({ email, password, rememberme, userAgent, ip }) {
    const userFound = await this.#userRepository.findByEmail(email);

    if (!userFound) throw new NotFoundError("User not found");

    const user = this.#userFactory.create(userFound);

    if (!user.isVerified) {
      throw new UnauthorizedError("User not verified");
    }

    if (user.deletedAt) {
      throw new NotFoundError("User allready deleted");
    }

    const hasEmailLogin = userFound.loginMethods?.some(
      (method) => method.provider === "email",
    );
    if (!hasEmailLogin) {
      throw new InvalidCredentialsError(
        "This account cannot login with email, try another method.",
      );
    }

    const isPasswordValid = await this.#hashService.verify(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsError("Wrong password");
    }

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
