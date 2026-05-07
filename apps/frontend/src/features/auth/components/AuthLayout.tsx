import { useEffect } from "react";
import { getMe } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Outlet } from "react-router";

// Root layout for all routes. Runs one session check on mount to hydrate the
// auth store before any route renders. isInitialized gates the Outlet so
// protected routes never flash before the check resolves.
export default function AuthLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    if (isInitialized) return;
    (async () => {
      try {
        setUser(await getMe());
        setInitialized(true);
      } catch (err) {
        if (err) setUser(null);
        setInitialized(true);
      }
    })();
  }, [setUser, setInitialized, isInitialized]);
  if (!isInitialized) return <div>Loading...</div>;
  return <Outlet />;
}
