import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { signOut } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  async function handleClick() {
    // Clear local state optimistically before the API call so the nav updates
    // immediately. If signOut fails the user is already on /account which will
    // redirect them away via ProtectedRoute anyway.
    setUser(null);
    await signOut();
    navigate("/account");
  }
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
    >
      <LogOut className="size-3.5" />
      Sign out
    </Button>
  );
}
