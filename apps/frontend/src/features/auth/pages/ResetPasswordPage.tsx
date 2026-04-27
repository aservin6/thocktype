import { Navigate, useNavigate, useSearchParams } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect, useState } from "react";
import { apiClient } from "@/shared/api/client";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "invalid" | "form" | "success"
  >("loading");
  const navigate = useNavigate();
  const onSuccess = () => setStatus("success");
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    async function fetchToken() {
      try {
        if (!tokenParam) {
          setStatus("invalid");
          return;
        }
        const res = await apiClient(
          `/auth/verify-reset-token?token=${tokenParam}`,
          { method: "GET" },
          { skipRefresh: true },
        );
        if (!res.ok) {
          setStatus("invalid");
          return;
        }
        setStatus("form");
      } catch (err) {
        setStatus("invalid");
      }
    }
    fetchToken();
  }, [searchParams]);

  useEffect(() => {
    if (status === "success") {
      const countdownId = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
      const timerId = setTimeout(() => {
        navigate("/signin");
      }, 5000);

      return () => {
        clearInterval(countdownId);
        clearTimeout(timerId);
      };
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "invalid") return <Navigate to="/" replace />;
  return (
    <div>
      {status === "form" && <ResetPasswordForm onSuccess={onSuccess} />}
      {status === "success" && (
        <div>
          <div>PASSWORD RESET SUCCESSFUL</div>
          <div>REDIRECTING TO SIGN IN PAGE IN {timeLeft} SECONDS</div>
        </div>
      )}
    </div>
  );
}
