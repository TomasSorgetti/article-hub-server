import envConfig from "./env.config.js";
import { connectDB } from "../database/database.js";
import { connectEmail } from "../services/email/client.js";
import connectStripe from "../services/stripe/client.js";
import FakeEmailQueueService from "../services/queue/fake-email-queue.service.js";

export const initializeConfig = async () => {
  const db = await connectDB(envConfig.MONGO_URL);
  const email = await connectEmail(envConfig.RESEND_API_KEY);
  const emailQueueService = new FakeEmailQueueService();
  const stripe = connectStripe(envConfig.STRIPE_SECRET_KEY);

  return {
    db,
    email,
    queues: { emailQueueService },
    stripe,
    env: envConfig,
  };
};
