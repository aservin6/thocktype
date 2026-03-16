import { useEffect } from "react";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function TypingTimer() {
  const { tick, state, elapsedTime, timeLimit, mode } = useTypingEngine();
  const remainingTime = timeLimit - elapsedTime;

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 100);

    return () => clearInterval(interval);
  }, [tick]);

  return (
    <>
      {state?.status === "running" && mode === "timed" && (
        <div className="absolute -top-full text-red-300 text-3xl left-0">
          {Math.floor(remainingTime / 1000)}
        </div>
      )}
    </>
  );
}
