import { useForm, type SubmitHandler } from "react-hook-form";
import { register as registerUser } from "../api/auth";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

type Inputs = {
  email: string;
  password: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const setUser = useAuthStore((s) => s.setUser);
  const setInitialized = useAuthStore((s) => s.setInitialized);
  const [error, setError] = useState<string | null>(null);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    try {
      const user = await registerUser(email, password);
      if (user) {
        setUser(user);
        setInitialized(true);
      }
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
