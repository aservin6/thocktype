import { Outlet } from "react-router";

export default function Container() {
  return (
    <div className="bg-neutral-800 text-neutral-200 dark:bg-neutral-800 dark:text-neutral-200">
      <div className="mx-auto min-h-screen max-w-7xl px-1.5 py-3">
        <Outlet />
      </div>
    </div>
  );
}
