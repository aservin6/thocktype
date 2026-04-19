import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
