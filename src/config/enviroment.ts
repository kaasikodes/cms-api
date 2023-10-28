import { config } from "dotenv";
config();

export const ENV = {
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: {
    DB_CONNECTION: process.env.DB_CONNECTION,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  AUTH_TOKEN_EXPIRES_IN: process.env.AUTH_TOKEN_EXPIRES_IN,
  // PASSWORD_RESET_TOKEN_EXPIRES_IN: 12000000,
  PASSWORD_RESET_TOKEN_EXPIRES_IN: process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  APP_DOMAIN: process.env.APP_DOMAIN,
};
