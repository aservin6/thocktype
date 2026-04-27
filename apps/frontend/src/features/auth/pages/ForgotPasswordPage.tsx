import { useState } from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const user = useAuthStore((s) => s.user);

  const onSuccess = () => setIsSuccess(true);

  if (user) return <Navigate to="/account" replace />;
  return (
    <div>
      {!isSuccess && <ForgotPasswordForm onSuccess={onSuccess} />}
      {isSuccess && <div>SUCCESS</div>}
    </div>
  );
}
