import { useEffect } from "react";
import { TypingTest } from "./components/TypingTest";
import { getMe } from "./api/auth";
import { useAuthStore } from "./store/useAuthStore";

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
