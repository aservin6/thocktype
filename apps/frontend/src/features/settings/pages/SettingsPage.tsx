import {
  Bell,
  Eye,
  Keyboard,
  Palette,
  Shield,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settingsSections = [
  {
    title: "Typing defaults",
    description: "Starting mode, test length, and behavior preferences.",
    icon: Keyboard,
    items: ["Default mode", "Default test value", "Strict-mode behavior"],
  },
  {
    title: "Appearance",
    description: "Theme, typography, caret style, and typing surface density.",
    icon: Palette,
    items: ["Theme", "Font family", "Caret style"],
  },
  {
    title: "Feedback",
    description: "Sound, visual feedback, result summaries, and notifications.",
    icon: Bell,
    items: ["Key sounds", "Error feedback", "Result notifications"],
  },
  {
    title: "Privacy & account",
    description: "Profile visibility, leaderboard presence, and account controls.",
    icon: Shield,
    items: ["Public profile", "Leaderboard visibility", "Account actions"],
  },
];

const preferenceChips = [
  "standard · 25 words",
  "dark theme",
  "victor mono",
  "smooth caret",
];

export default function SettingsPage() {
  return (
    <main className="text-foreground relative mx-auto flex w-full max-w-6xl flex-col gap-8 overflow-hidden px-3 py-8 sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_18%_8%,oklch(0.75_0.075_220/.16),transparent_34%),radial-gradient(circle_at_82%_4%,oklch(0.72_0.08_190/.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(1_0_0/.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/.03)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_72%)] bg-size-[44px_44px] opacity-35" />

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <div className="space-y-5">
          <div className="border-border/70 bg-card/70 text-muted-foreground inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-medium tracking-[0.24em] uppercase backdrop-blur">
            <SlidersHorizontal className="size-3.5" />
            Preferences
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl leading-tight font-semibold tracking-[-0.06em] sm:text-5xl">
              Settings cockpit
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
              Scaffold for future account, typing, appearance, and privacy
              controls. These panels are intentionally static placeholders for
              now.
            </p>
          </div>
        </div>

        <Card className="border-border/70 bg-card/65 p-5 shadow-sm backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <div className="border-border/70 bg-muted/70 text-primary flex size-10 items-center justify-center border">
              <Eye className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">Current profile</p>
              <p className="text-muted-foreground text-xs">Preview only</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {preferenceChips.map((chip) => (
              <span
                key={chip}
                className="border-border/70 bg-background/50 text-muted-foreground border px-2.5 py-1 text-xs"
              >
                {chip}
              </span>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;

          return (
            <Card
              key={section.title}
              className="border-border/70 bg-card/65 p-5 shadow-sm backdrop-blur"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="border-border/70 bg-muted/70 text-primary flex size-11 shrink-0 items-center justify-center border">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-base font-semibold tracking-[-0.02em]">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-5">
                    {section.description}
                  </p>
                </div>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="border-border/60 bg-background/35 flex items-center justify-between border px-3 py-2.5"
                  >
                    <span className="text-sm">{item}</span>
                    <span className="text-muted-foreground text-xs uppercase tracking-[0.18em]">
                      TODO
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </section>

      <section className="border-border/70 bg-card/65 flex flex-col gap-4 border p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-[-0.02em]">
            Ready for implementation
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Wire these placeholders to persisted preferences when the settings
            model is finalized.
          </p>
        </div>
        <Button type="button" variant="outline" disabled>
          Save changes
        </Button>
      </section>
    </main>
  );
}
