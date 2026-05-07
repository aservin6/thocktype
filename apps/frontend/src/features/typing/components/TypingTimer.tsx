import { useEffect } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function TypingTimer() {
  const { tick, state, timeElapsed, timeLimit } = useTypingEngine();
  const remainingTime = timeLimit - timeElapsed;

  // 100ms interval keeps the displayed countdown smooth. The engine's checkTime
  // call inside tick() is what actually ends the test, not the interval itself.
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
