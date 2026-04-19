import { useEffect } from "react";
import { TypingTest } from "./features/typing/components/TypingTest";
import { getMe } from "./features/auth/api/auth";
import { useAuthStore } from "./features/auth/store/useAuthStore";

function App() {
  const setUser = useAuthStore((s) => s.setUser);
  useEffect(() => {
    async function fetchGetMe() {
      try {
        setUser(await getMe());
      } catch (err) {
        if (err) setUser(null);
      }
    }
    fetchGetMe();
  }, [setUser]);
  return (
    <>
      <TypingTest />
    </>
  );
}

export default App;
