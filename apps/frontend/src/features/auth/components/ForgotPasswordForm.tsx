import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  type ForgotPasswordRequest,
  forgotPasswordRequestSchema,
} from "@thocktype/shared";

export default function ForgotPasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordRequestSchema),
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: ForgotPasswordRequest) {
    try {
      await forgotPassword(values);
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
