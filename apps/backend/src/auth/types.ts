import type { BetterAuthOptions } from "better-auth";

export type SendResetPassword = NonNullable<
  NonNullable<BetterAuthOptions["emailAndPassword"]>["sendResetPassword"]
>;

export type UserCreateBeforeHook = NonNullable<
  NonNullable<
    NonNullable<BetterAuthOptions["databaseHooks"]>["user"]
  >["create"]
>["before"];
