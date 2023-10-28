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
  console.log(ENV.AUTH_TOKEN_EXPIRES_IN, "EXPIRES IN");
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
        console.log("Error verifying token:", err);
      }
      return decoded;
    }
  );

export const sendResetPasswordEmail = (email: string, resetToken: string) => {
  // TODO: Implement proper logic to send mail
  console.log(`Email sent to ${email} with reset token: ${resetToken}`);
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
