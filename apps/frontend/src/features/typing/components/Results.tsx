import { getElapsedTime, getWPM, getAccuracy } from "@thockr/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function Results() {
  const { state } = useTypingEngine();

  return (
    <Card className="w-full max-w-md border bg-card/80 shadow-lg shadow-background/30">
      <CardHeader>
        <CardTitle className="text-lg">Session complete</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-lg font-semibold">
        {state ? (
          <>
            <ResultRow label="Time" value={`${Math.round(getElapsedTime(state) / 1000)}s`} />
            <ResultRow label="WPM" value={Math.round(getWPM(state)).toString()} />
            <ResultRow label="Accuracy" value={`${Math.round(getAccuracy(state))}%`} />
          </>
        ) : (
          <div className="text-muted-foreground">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-primary">{value}</span>
    </div>
  );
}
