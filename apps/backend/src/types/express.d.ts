import { PublicUser } from "@typing-test/shared";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}
