import { useEffect } from "react";
import { checkSession } from "../api/auth";
import { useAuthStore } from "../store/useAuthStore";
import { Outlet } from "react-router";

export default function AuthLayout() {
  const setUser = useAuthStore((s) => s.setUser);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const setInitialized = useAuthStore((s) => s.setInitialized);

  useEffect(() => {
    if (isInitialized) return;
    (async () => {
      try {
        setUser(await checkSession());
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
