import { Navigate } from "react-router";
import RegisterForm from "../components/RegisterForm";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function RegisterPage() {
  const { user, isPending } = useCurrentUser();

  if (isPending) return <div>Loading...</div>;
  if (user) return <Navigate to="/account" replace />;

  return (
    <div>
      <RegisterForm />
    </div>
  );
}
