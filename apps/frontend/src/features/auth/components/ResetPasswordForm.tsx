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
import { resetPassword } from "../api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordRequestSchema,
  type ResetPasswordRequest,
} from "@thocktype/shared";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";

export default function ResetPasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordRequestSchema),
  });

  async function onSubmit(values: ResetPasswordRequest) {
    try {
      await resetPassword({ token, input: values });
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
        <FieldTitle className="text-xl font-bold">Password Reset</FieldTitle>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="password" className="text-base font-medium">
              New Password
            </FieldLabel>
            <Input
              id="password"
              placeholder="********"
              type="password"
              {...form.register("password")}
            />

            <div className="relative py-1">
              <FieldError className="absolute">
                {form.formState.errors.password?.message}
              </FieldError>
            </div>
          </Field>
          <Field>
            <FieldLabel
              htmlFor="confirmPassword"
              className="text-base font-medium"
            >
              Confirm Password
            </FieldLabel>
            <Input
              id="confirmPassword"
              placeholder="********"
              type="password"
              {...form.register("confirmPassword")}
            />
            <div className="relative py-1">
              <FieldError className="absolute">
                {form.formState.errors.confirmPassword?.message}
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
