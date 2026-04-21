import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  const user = useAuthStore((s) => s.user);

  if (user) return <Navigate to="/account" replace />;

  return (
    <div>
      <SignInForm />
    </div>
  );
}
