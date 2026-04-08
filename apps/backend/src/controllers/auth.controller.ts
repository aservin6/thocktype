import type { Request, Response } from "express";
import { register } from "../services/auth.service.ts";

export async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  try {
    const user = await register(email, password);
    const { token, ...publicUser } = user;

    res.cookie("auth_token", token, {
      httpOnly: true,
    });
    res.status(201).json({
      data: publicUser,
      message: "New user registered successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "User already exists") {
        res.status(409).json({ message: err.message });
      } else {
        res.status(500).json({ message: "A server side error occurred" });
      }
    }
  }
}
