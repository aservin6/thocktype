import { Outlet } from "react-router";

export default function Container() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto min-h-screen max-w-7xl px-3 py-4 sm:px-6">
        <Outlet />
      </div>
    </div>
  );
}
