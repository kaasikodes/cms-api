import jwt from "jsonwebtoken";
import * as fs from "fs";
import { ENV } from "../config/enviroment";

const privateKey = fs.readFileSync("private-key.pem", "utf8");
const publicKey = fs.readFileSync("public-key.pem", "utf8");
export const generatePasswordResetToken = ({ id }: { id: string }) =>
  jwt.sign({ id }, privateKey, {
    algorithm: "RS256",
    issuer: ENV.APP_DOMAIN,
    expiresIn: ENV.PASSWORD_RESET_TOKEN_EXPIRES_IN,
  });
export const generateAuthToken = ({
  id,
  password,
}: {
  id: string;
  password?: string | null;
}) => {
  return jwt.sign({ id, password }, privateKey, {
    algorithm: "RS256",
    issuer: ENV.APP_DOMAIN,
    expiresIn: ENV.AUTH_TOKEN_EXPIRES_IN,
  });
};
export const verifyToken = ({ token }: { token: string }) =>
  jwt.verify(
    token,
    publicKey,
    {
      algorithms: ["RS256"],
      issuer: ENV.APP_DOMAIN,
    },
    (err, decoded) => {
      if (err) {
        // TODO : implement a log debugging
        console.log("Error verifying token:", err);
      }
      return decoded;
    }
  );

export const sendResetPasswordEmail = (email: string, resetToken: string) => {
  // TODO: Implement proper logic to send mail
};

export const excludeTypesInModel = <ModelType, Key extends keyof ModelType>(
  user: ModelType,
  keys: Key[]
): Omit<ModelType, Key> => {
  return Object.fromEntries(
    Object.entries(user as Record<string, unknown>).filter(
      ([key]) => !keys.includes(key as Key)
    )
  ) as Omit<ModelType, Key>;
};
