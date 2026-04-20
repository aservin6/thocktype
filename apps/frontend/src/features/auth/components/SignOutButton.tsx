import { useNavigate } from "react-router";
import { signOut } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  async function handleClick() {
    setUser(null);
    await signOut();
    navigate("/account");
  }
  return (
    <Button
      onClick={handleClick}
      className="bg-red-400 rounded-lg text-white p-2 font-bold"
    >
      Sign out
    </Button>
  );
}
