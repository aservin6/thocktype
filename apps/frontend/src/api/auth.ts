import { type PublicUser } from "@typing-test/shared";
import { apiClient } from "./client";

export async function signIn(
  email: string,
  password: string,
): Promise<PublicUser> {
  const res = await apiClient("/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function register(
  email: string,
  password: string,
): Promise<PublicUser> {
  const res = await apiClient("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function signOut(): Promise<void> {
  const res = await apiClient("/auth/signout", {
    method: "POST",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
}

export async function getMe(): Promise<PublicUser> {
  const res = await apiClient("/me", {
    method: "GET",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}
