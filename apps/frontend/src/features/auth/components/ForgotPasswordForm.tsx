import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  FieldSet,
  FieldTitle,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password is too short. Minimum of 8 characters")
      .max(72, "Password is too long. Maximum 72 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { password, confirmPassword } = values;
    try {
      console.log("Update password flow");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-xl space-y-8 py-10"
    >
      <FieldSet>
        <FieldTitle className="text-xl font-bold">Register</FieldTitle>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email" className="text-base font-medium">
              Email
            </FieldLabel>
            <Input
              id="email"
              placeholder="example@email.com"
              {...form.register("email")}
            />

            <div className="relative py-1">
              <FieldError className="absolute">
                {form.formState.errors.email?.message}
              </FieldError>
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="password" className="text-base font-medium">
              Password
            </FieldLabel>
            <Input
              id="password"
              placeholder="********"
              type="password"
              {...form.register("password")}
            />
            <FieldDescription>Enter your password.</FieldDescription>
            <div className="relative py-1">
              <FieldError className="absolute">
                {form.formState.errors.password?.message}
              </FieldError>
            </div>
          </Field>
        </FieldGroup>
      </FieldSet>
      <div className="text-sm">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-bold text-blue-400 hover:text-sky-600"
        >
          Sign in
        </Link>
      </div>
      {error && <FieldError>{error}</FieldError>}
      <Button type="submit" className="text-[1em]">
        Submit
      </Button>
    </form>
  );
}
