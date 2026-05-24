import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LeaderboardControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const isPrevDisabled = page <= 1;
  const isNextDisabled = page >= totalPages;
  return (
    <div className="relative flex w-full items-center">
      <div className="flex w-full items-center justify-center space-x-3">
        <Button
          onClick={() => {
            if (page <= 1) return;
            onPageChange(page - 1);
          }}
          className="size-8 hover:cursor-pointer"
          disabled={isPrevDisabled}
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          onClick={() => {
            if (page >= totalPages) return;
            onPageChange(page + 1);
          }}
          className="size-8 hover:cursor-pointer"
          disabled={isNextDisabled}
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
      <div className="absolute right-0 flex flex-col gap-3 sm:flex-row sm:justify-between">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
