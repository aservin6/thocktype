import { Navigate, useNavigate, useSearchParams } from "react-router";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const resetError = searchParams.get("error");
  const [status, setStatus] = useState<"form" | "success">("form");
  const navigate = useNavigate();
  const onSuccess = () => setStatus("success");
  const [timeLeft, setTimeLeft] = useState(5);

  // On success, run a visual countdown and then navigate to /signin.
  // Both the interval and the timeout are cleaned up if the component unmounts.
  useEffect(() => {
    if (status !== "success") return;

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
  }, [navigate, status]);

  if (resetError || !token) return <Navigate to="/" replace />;
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
