import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Link } from "react-router";

const formSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .max(254, "Email is too long (255+ characters)"),
  password: z
    .string()
    .min(8, "Password is too short. Minimum of 8 characters")
    .max(72, "Password is too long. Maximum 72 characters."),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      const user = await register(email, password);
      if (user) {
        setUser(user);
        setInitialized(true);
      }
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
