import { AlreadyExistsError } from "../../domain/errors/index.js";

export default class RegisterUseCase {
  #userRepository;
  #subscriptionRepository;
  #planRepository;
  #workbenchRepository;
  #hashService;
  #jwtService;
  #emailService;
  #emailQueueService;
  #userFactory;
  #subscriptionFactory;
  #workbenchFactory;
  #env;

  constructor({
    userRepository,
    subscriptionRepository,
    planRepository,
    workbenchRepository,
    hashService,
    jwtService,
    emailService,
    emailQueueService,
    userFactory,
    subscriptionFactory,
    workbenchFactory,
    env,
  }) {
    this.#userRepository = userRepository;
    this.#subscriptionRepository = subscriptionRepository;
    this.#planRepository = planRepository;
    this.#workbenchRepository = workbenchRepository;
    this.#hashService = hashService;
    this.#jwtService = jwtService;
    this.#emailService = emailService;
    this.#emailQueueService = emailQueueService;
    this.#userFactory = userFactory;
    this.#subscriptionFactory = subscriptionFactory;
    this.#workbenchFactory = workbenchFactory;
    this.#env = env;
  }

  async execute({ username, email, password, preferences }) {
    const existingUser = await this.#userRepository.findByEmail(email);
    if (existingUser) {
      throw new AlreadyExistsError("User allready exists");
    }

    const hashedPassword = await this.#hashService.hash(password);

    const userEntity = this.#userFactory.create({
      username,
      email,
      password: hashedPassword,
      preferences,
    });
    // Add email login method
    userEntity.addLoginMethod({ provider: "email", addedAt: new Date() });

    const newUser = await this.#userRepository.create(userEntity.toObject());

    const freePlan = await this.#planRepository.findByName("free");

    const verificationToken = this.#jwtService.signCode(newUser._id);
    const verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    const subscriptionEntity = this.#subscriptionFactory.create({
      userId: newUser._id,
      planId: freePlan._id,
    });

    const newSubscription = await this.#subscriptionRepository.create(
      subscriptionEntity.toObject(),
    );

    const workbenchEntity = this.#workbenchFactory.create({
      name: "My Workspace",
      owner: newUser._id,
      members: [{ userId: newUser._id, role: "owner" }],
    });

    await this.#workbenchRepository.create(workbenchEntity.toObject());

    await this.#userRepository.update(newUser._id, {
      subscription: newSubscription._id,
      verificationToken,
      verificationTokenExpires,
    });

    await this.#emailQueueService.addJob({
      type: "VERIFY_EMAIL",
      to: newUser.email,
      subject: "Verify your email",
      html: `
        <h1>Verify your email, token expires in 1 hour</h1>
        <h2>IMPORTANTE: Para desarrollo, copiá el token del url y envialo en el campo "token" de la query en la ruta /api/auth/verify</h2>
        <p>Token: ${verificationToken}</p>
        <a href='${
          this.#env.FRONT_URL
        }/verify-email?token=${verificationToken}'>Verify email</a>
      `,
    });

    return {
      username: newUser.username,
      email: newUser.email,
      tokenExpiresIn: verificationTokenExpires,
    };
  }
}
