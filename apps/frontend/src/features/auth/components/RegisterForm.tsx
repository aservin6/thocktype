import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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
import { register } from "../api/auth";
import {
  type RegisterRequest,
  registerRequestSchema,
} from "@thocktype/shared";

export default function RegisterForm() {
  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: RegisterRequest) {
    try {
      await register(values);
      navigate("/account");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <Card className="bg-card/80 shadow-background/30 mx-auto mt-10 w-full max-w-xl border shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Register</CardTitle>
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
          <div className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-primary hover:text-primary/80 font-bold"
            >
              Sign in
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
