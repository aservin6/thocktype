import { useTypingEngine } from "../hooks/useTypingEngine";
import TypingTimer from "./TypingTimer";
import WordCountProgress from "./WordCountProgress";

export default function TestWidget() {
  const { state } = useTypingEngine();

  return (
    <>{state?.mode === "timed" ? <TypingTimer /> : <WordCountProgress />}</>
  );
}
