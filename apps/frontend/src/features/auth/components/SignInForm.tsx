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
import { signIn } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import { Link } from "react-router";

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string(),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      const user = await signIn(email, password);
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
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-xl space-y-8 py-10"
      >
        <FieldSet>
          <FieldTitle className="text-xl font-bold">Sign In</FieldTitle>
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

        <div className="flex flex-col items-start space-y-3 text-sm">
          <div>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-blue-400 hover:text-sky-600"
            >
              Create account
            </Link>
          </div>
          <Link
            to="/forgot-password"
            className="font-bold text-blue-400 hover:text-sky-600"
          >
            Forgot password?
          </Link>
        </div>
        {error && <FieldError>{error}</FieldError>}
        <Button
          type="submit"
          className="w-full py-5 text-base hover:cursor-pointer"
        >
          Submit
        </Button>
      </form>
    </>
  );
}
