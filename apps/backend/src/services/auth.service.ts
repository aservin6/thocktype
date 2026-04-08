import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
} from "../repositories/user.repository.ts";
import requireEnv from "../utils/require-env.ts";
import type { PublicUser } from "@typing-test/shared";

const JWT_SECRET = requireEnv("JWT_SECRET");

export async function register(
  email: string,
  password: string,
): Promise<PublicUser & { token: string }> {
  const username = email.split("@")[0];

  const user = await findUserByEmail(email);
  if (user) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    email,
    username,
    password_hash: hashedPassword,
  });

  const userPayload = {
    id: newUser.id,
  };

  const token = jwt.sign(userPayload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    email_verified: newUser.email_verified,
    created_at: newUser.created_at,
    token,
  };
}
