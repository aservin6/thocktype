import { useEffect } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function TypingTimer() {
  const { tick, state, timeElapsed, timeLimit } = useTypingEngine();
  const remainingTime = timeLimit - timeElapsed;

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [tick]);

  return (
    <>
      {state?.status === "running" && (
        <div className="absolute -top-full left-0 text-3xl text-red-300">
          {Math.floor(remainingTime / 1000)}
        </div>
      )}
    </>
  );
}
