import SignOutButton from "@/features/auth/components/SignOutButton";
import type { PublicUser } from "@typing-test/shared";

type AccountHeaderProps = {
  user: PublicUser | null;
};

export function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <header className="border-border/70 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          Account
        </p>
        <h1 className="text-background text-3xl font-semibold tracking-normal">
          {user?.username ?? "Profile"}
        </h1>
        <p className="text-muted-foreground text-sm">{user?.email}</p>
      </div>
      <SignOutButton />
    </header>
  );
}
