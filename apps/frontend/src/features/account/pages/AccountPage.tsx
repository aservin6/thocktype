import { useAuthStore } from "@/features/auth/store/useAuthStore";
import SignOutButton from "../../auth/components/SignOutButton";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  return (
    <div>
      <div>{user?.username}</div>
      <div>Account Page</div>
      <SignOutButton />
    </div>
  );
}
