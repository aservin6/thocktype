import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { signOut } from "../api/auth";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  const navigate = useNavigate();

  async function handleClick() {
    await signOut();
    navigate("/signin");
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
