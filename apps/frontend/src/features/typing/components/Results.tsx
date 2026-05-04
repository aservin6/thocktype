import { getElapsedTime, getWPM, getAccuracy } from "@typing-test/shared";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function Results() {
  const { state } = useTypingEngine();

  return (
    <div className="text-2xl font-bold text-white">
      {state ? (
        <>
          <div>Time: {Math.round(getElapsedTime(state) / 1000)}s</div>
          <div>WPM: {Math.round(getWPM(state))}</div>
          <div>Accuracy: {Math.round(getAccuracy(state))}%</div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
