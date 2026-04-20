import { useNavigate } from "react-router";
import SignInForm from "../components/SignInForm";
import { useAuthStore } from "../store/useAuthStore";
import SignInFormTest from "../components/SignInFormTest";

export default function SignInPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (user) navigate("/account");

  return (
    <div>
      <div>Sign in</div>
      <div>
        <SignInForm />
      </div>
      <div>
        <SignInFormTest />
      </div>
    </div>
  );
}
