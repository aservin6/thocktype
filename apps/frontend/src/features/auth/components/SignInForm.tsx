import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { type SignInRequest, signInRequestSchema } from "@typing-test/shared";

export default function SignInForm() {
  const form = useForm<SignInRequest>({
    resolver: zodResolver(signInRequestSchema),
  });
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: SignInRequest) {
    try {
      const user = await signIn(values);
      if (user) {
        setUser(user);
        setInitialized(true);
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <Card className="bg-card/80 shadow-background/30 mx-auto mt-10 w-full max-w-xl border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FieldSet>
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
                <FieldLabel
                  htmlFor="password"
                  className="text-base font-medium"
                >
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

          <div className="text-muted-foreground flex flex-col items-start gap-3 text-sm">
            <div>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/80 font-bold"
              >
                Create account
              </Link>
            </div>
            <Link
              to="/forgot-password"
              className="text-primary hover:text-primary/80 font-bold"
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
      </CardContent>
    </Card>
  );
}
