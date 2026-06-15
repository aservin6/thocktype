import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useCurrentUser } from "../hooks/useCurrentUser";

type AuthGateAccess = "authenticated" | "guest";

type AuthGateProps = {
  access: AuthGateAccess;
  children: ReactNode;
  redirectTo?: string;
};

export default function AuthGate({
  access,
  children,
  redirectTo,
}: AuthGateProps) {
  const { user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) return <div>Loading...</div>;

  if (access === "authenticated" && !user) {
    return (
      <Navigate
        to={redirectTo ?? "/signin"}
        replace
        state={{ from: location }}
      />
    );
  }

  if (access === "guest" && user) {
    return <Navigate to={redirectTo ?? "/account"} replace />;
  }

  return children;
}
