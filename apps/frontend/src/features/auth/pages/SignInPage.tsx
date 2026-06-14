import { Navigate } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";
import SignInForm from "../components/SignInForm";

export default function SignInPage() {
  const { user, isPending } = useCurrentUser();

  if (isPending) return <div>Loading...</div>;
  if (user) return <Navigate to="/account" replace />;

  return (
    <div>
      <SignInForm />
    </div>
  );
}
