import { useNavigate } from "react-router";
import RegisterForm from "../components/RegisterForm";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  if (user) navigate("/account");

  return (
    <div>
      <div>Register</div>
      <div>
        <RegisterForm />
      </div>
    </div>
  );
}
