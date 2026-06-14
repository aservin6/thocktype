import type { PublicUser } from "@thocktype/shared";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}
