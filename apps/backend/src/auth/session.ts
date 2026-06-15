import { authUserToPublicUser } from "@thocktype/shared";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "./auth.ts";

export async function getRequestUser(req: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return session ? authUserToPublicUser(session.user) : null;
}

export function requireUser(req: Request) {
  const user = req.user;
  if (!user) throw Error("Unauthorized request.");
  return user;
}

export function requireUserId(req: Request) {
  return requireUser(req).id;
}
