import type { Request, Response } from "express";
import { register, signIn } from "../services/auth.service.ts";

export async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // Pass user input into register flow
  try {
    const user = await register(email, password);
    const { token, ...publicUser } = user;

    // Set auth cookie upon successful user registration
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

export async function signInUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  // Pass user input into sign in flow
  try {
    const user = await signIn(email, password);
    const { token, ...publicUser } = user;

    // Set auth cookie upon successful user sign in
    res.cookie("auth_token", token, {
      httpOnly: true,
    });
    res.status(200).json({
      data: publicUser,
      message: "User signed in successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Confirm sign in details and try again") {
        res.status(401).json({ message: err.message });
      } else {
        res.status(500).json({ message: "A server side error occurred" });
      }
    }
  }
}

export async function signOutUser(req: Request, res: Response): Promise<void> {
  res.clearCookie("auth_token");
  res.status(200).json({ message: "Signed out successfully" });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: req.user });
}
