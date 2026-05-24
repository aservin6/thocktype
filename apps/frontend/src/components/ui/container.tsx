import { Outlet } from "react-router";

export default function Container() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="mx-auto min-h-screen max-w-384 px-3 py-4 sm:px-6">
        <Outlet />
      </div>
    </div>
  );
}
