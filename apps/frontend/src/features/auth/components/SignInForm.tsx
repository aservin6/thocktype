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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-xl mx-auto w-full py-10"
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

            <FieldError>{form.formState.errors.email?.message}</FieldError>
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
            <FieldError>{form.formState.errors.password?.message}</FieldError>
          </Field>
        </FieldGroup>
      </FieldSet>
      {error && <FieldError>{error}</FieldError>}
      <Button type="submit" className="text-[1em]">
        Submit
      </Button>
    </form>
  );
}
