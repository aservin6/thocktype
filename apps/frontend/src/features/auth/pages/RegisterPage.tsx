import { Navigate } from "react-router";
import RegisterForm from "../components/RegisterForm";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterPage() {
  const user = useAuthStore((s) => s.user);

  if (user) return <Navigate to="/account" replace />;

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
