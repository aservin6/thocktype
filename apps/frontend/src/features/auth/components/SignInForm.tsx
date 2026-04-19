import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "../api/auth";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const [error, setError] = useState<string | null>(null);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    try {
      await signIn(email, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        placeholder="example@email.com"
        {...register("email", {
          required: true,
          max: 254,
        })}
      />
      <input {...register("password", { required: true })} />
      {error && <span>{error}</span>}
      {errors.email && <span>Email is required</span>}
      {errors.password && <span>Password is required</span>}
      <input type="submit" />
    </form>
  );
}
