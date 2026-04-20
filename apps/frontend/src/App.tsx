import { TypingTest } from "./features/typing/components/TypingTest";
import { useAuthStore } from "./features/auth/store/useAuthStore";

function App() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <div>{user?.username}</div>
      <TypingTest />
    </>
  );
}

export default App;
