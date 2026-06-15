import { createAuthClient } from "better-auth/react";

// The username plugin remains server-side only. The frontend should not call
// public username availability/sign-in endpoints for the current auth flow.
export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});
