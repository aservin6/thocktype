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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "../api/auth";

const formSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .max(254, "Email is too long (255+ characters)"),
});

export default function ForgotPasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email } = values;
    try {
      await forgotPassword(email);
      onSuccess();
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
        <FieldTitle className="text-xl font-bold">Forgot Password?</FieldTitle>
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
        </FieldGroup>
      </FieldSet>
      {error && <FieldError>{error}</FieldError>}
      <Button
        type="submit"
        className="w-full py-5 text-base hover:cursor-pointer"
      >
        Submit
      </Button>
    </form>
  );
}
