import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";
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
import { useAuthStore } from "../store/useAuthStore";

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
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <Card className="mx-auto mt-10 w-full max-w-xl border bg-card/80 shadow-lg shadow-background/30">
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
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="font-bold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
          {error && <FieldError>{error}</FieldError>}
          <Button type="submit" className="w-full py-5 text-base hover:cursor-pointer">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
