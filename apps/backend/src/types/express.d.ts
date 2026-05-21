import { PublicUser } from "@thockr/shared";
import { PasswordResetToken } from "./token.ts";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
      passwordResetToken?: PasswordResetToken;
    }
  }
}
