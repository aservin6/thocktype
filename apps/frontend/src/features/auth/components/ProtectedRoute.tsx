import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUser();

  if (isPending) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
