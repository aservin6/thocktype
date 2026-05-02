import { Navigate, useNavigate, useSearchParams } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect, useState } from "react";
import { fetchToken } from "../api/auth";

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
    (async () => {
      try {
        await fetchToken(tokenParam);
        setStatus("form");
      } catch {
        setStatus("invalid");
      }
    })();
  }, []);

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
