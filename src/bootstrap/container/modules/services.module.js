import HashService from "../../../infrastructure/security/hash.js";
import JWTService from "../../../infrastructure/security/jwt.js";
import EmailService from "../../../infrastructure/services/email/service.js";
import SocketService from "../../../infrastructure/services/socket/service.js";
import StripeService from "../../../infrastructure/services/stripe/service.js";
import GoogleAuthStrategy from "../../../infrastructure/strategies/google.strategy.js";
import { storageFactory } from "../../../infrastructure/storage/index.js";
import FakeEmailQueueService from "../../../infrastructure/services/queue/fake-email-queue.service.js";

export const registerServices = (container, config) => {
  const hashService = new HashService({
    saltRounds: config.env.HASH_SALT_ROUNDS,
  });
  const jwtService = new JWTService({
    accessSecret: config.env.JWT_ACCESS_SECRET,
    refreshSecret: config.env.JWT_REFRESH_SECRET,
  });
  const emailService = new EmailService(config.email);
  const emailQueueService = config.queues.emailQueueService;
  if (emailQueueService instanceof FakeEmailQueueService) {
    emailQueueService.context = { emailService };
  }
  const socketService = new SocketService();
  const stripeService = new StripeService(config.stripe);
  const storageService = storageFactory(config);
  const googleAuthStrategy = new GoogleAuthStrategy({
    clientId: config.env.GOOGLE_CLIENT_ID,
  });

  container.register("hashService", hashService);
  container.register("jwtService", jwtService);
  container.register("emailService", emailService);
  container.register("emailQueueService", emailQueueService);
  container.register("socketService", socketService);
  container.register("stripeService", stripeService);
  container.register("storageService", storageService);
  container.register("googleAuthStrategy", googleAuthStrategy);
};
