import { useState } from "react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const onSuccess = () => setIsSuccess(true);

  return (
    <div>
      {!isSuccess && <ForgotPasswordForm onSuccess={onSuccess} />}
      {isSuccess && <div>SUCCESS</div>}
    </div>
  );
}
