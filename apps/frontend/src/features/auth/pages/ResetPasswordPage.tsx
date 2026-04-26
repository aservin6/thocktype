import { Navigate, useSearchParams } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [isInitialized, setInitialized] = useState(false);
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    async function fetchToken() {
      try {
        if (!tokenParam) {
          return;
        }
        const res = await fetch(`/auth/verify-reset-token?token=${tokenParam}`);
        if (!res.ok) {
          return;
        }
        setIsValid(true);
      } catch (err) {
      } finally {
        setInitialized(true);
      }
    }
    fetchToken();
  }, [searchParams]);

  if (!isInitialized) return <div>Loading...</div>;
  if (!isValid) return <Navigate to="/" replace />;
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}
