import { useState } from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { Navigate } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { user, isPending } = useCurrentUser();

  const onSuccess = () => setIsSuccess(true);

  if (isPending) return <div>Loading...</div>;
  if (user) return <Navigate to="/account" replace />;
  return (
    <div>
      {!isSuccess && <ForgotPasswordForm onSuccess={onSuccess} />}
      {isSuccess && <div>SUCCESS</div>}
    </div>
  );
}
