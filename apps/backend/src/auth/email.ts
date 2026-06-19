import { Resend } from "resend";
import requireEnv from "../utils/require-env.ts";
import type { SendResetPassword } from "./types.ts";

const resend = new Resend(requireEnv("RESEND_API_KEY"));
const authEmailFrom = requireEnv("AUTH_EMAIL_FROM");

export const sendPasswordResetEmail = (async ({ user, url }) => {
  await resend.emails.send({
    from: authEmailFrom,
    to: user.email,
    subject: "Reset your password",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  });
}) satisfies SendResetPassword;
