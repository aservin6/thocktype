import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import type { ReactNode } from "react";

// isInitialized check prevents a redirect to /signin before AuthLayout's
// session check completes. Without it, a logged-in user on /account would be
// bounced on every hard refresh.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  if (!isInitialized) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
