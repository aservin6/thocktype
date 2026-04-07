import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createUser,
} from "../repositories/user.repository.ts";
import { Request, Response } from "express";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;
  const username = email.split("@")[0];

  try {
    const user = await findUserByEmail(email);
    if (user) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      email,
      username,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unexpected error occured" });
    }
  }
}
