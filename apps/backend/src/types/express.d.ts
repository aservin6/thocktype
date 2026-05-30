import { PublicUser } from "@thocktype/shared";
import { PasswordResetToken } from "./token.ts";

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser;
      passwordResetToken?: PasswordResetToken;
    }
  }
}
