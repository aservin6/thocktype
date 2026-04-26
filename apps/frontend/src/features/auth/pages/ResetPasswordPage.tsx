import { Navigate, useSearchParams } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState(null);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    async function fetchToken(token: string) {
      await fetch(`/auth/verify-reset-token?token=${tokenParam}`);
    }
  }, [searchParams]);

  if (!isInitialized) return <div>Loading...</div>;
  if (!token) return <Navigate to="/" replace />;
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}
