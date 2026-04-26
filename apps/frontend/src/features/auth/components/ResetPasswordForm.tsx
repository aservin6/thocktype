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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function ResetPasswordForm() {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { password, confirmPassword } = values;
    try {
      console.log("password: ", password);
      console.log("confirm password: ", confirmPassword);
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
      <Button type="submit" className="text-[1em]">
        Submit
      </Button>
    </form>
  );
}
