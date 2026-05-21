import { Keyboard, Mail } from "lucide-react";
import SignOutButton from "@/features/auth/components/SignOutButton";
import type { PublicUser } from "@thockr/shared";

type AccountHeaderProps = {
  user: PublicUser | null;
};

export function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <header className="border-border/70 bg-card/55 relative overflow-hidden border p-5 shadow-sm shadow-background/30 backdrop-blur sm:p-6">
      <div className="absolute right-0 top-0 h-px w-1/2 bg-gradient-to-l from-primary/70 to-transparent" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="border-border/70 bg-muted/70 flex size-12 shrink-0 items-center justify-center border text-primary shadow-inner shadow-background/30">
            <Keyboard className="size-5" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs font-medium tracking-[0.35em] uppercase">
              Account console
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                {user?.username ?? "Profile"}
              </h1>
              {user?.email ? (
                <p className="text-muted-foreground mt-2 flex items-center gap-2 text-sm">
                  <Mail className="size-3.5" />
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
