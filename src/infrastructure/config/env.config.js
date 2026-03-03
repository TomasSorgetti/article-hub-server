import { config as dotenvConfig } from "dotenv";
import { cleanEnv, str, port } from "envalid";

dotenvConfig();

const env = cleanEnv(process.env, {
  PORT: port({ default: 8080 }),
  NODE_ENV: str({ default: "development" }),
  API_URL: str({ default: "http://localhost" }),
  FRONT_URL: str({ default: "http://localhost:4321" }),
  CORS_ORIGIN: str({ default: "http://localhost:5173" }),
  MONGO_URL: str({ default: "mongodb://localhost:27017/blog_saas" }),
  REDIS_URL: str({ default: "redis://redis:6379" }),
  JWT_ACCESS_SECRET: str({ default: "your_jwt_access_secret" }),
  JWT_REFRESH_SECRET: str({ default: "your_jwt_refresh_secret" }),
  HASH_SALT_ROUNDS: port({ default: 10 }),
  RESEND_API_KEY: str({ default: "your_resend_api_key" }),
  STRIPE_SECRET_KEY: str({ default: "sk_test_1234567890abcdef" }),
  AWS_ACCESS_KEY_ID: str({ default: "" }), // aws storage - prod
  AWS_SECRET_ACCESS_KEY: str({ default: "" }), // aws storage - prod
  AWS_REGION: str({ default: "" }), // aws storage - prod
  AWS_S3_BUCKET: str({ default: "" }), // aws storage - prod
  UPLOAD_DIR: str({ default: "./uploads" }), // local storage - dev
  GOOGLE_CLIENT_ID: str({ default: "" }),
  GOOGLE_CLIENT_SECRET: str({ default: "" }),
  GOOGLE_CALLBACK_URL: str({
    default: "http://localhost/auth/google/callback",
  }),
});

export default env;
