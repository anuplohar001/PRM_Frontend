import { cn } from "../../lib/utils";

const statusConfig: Record<string, { bg: string; text: string }> = {
  Todo: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-600 dark:text-neutral-400" },
  "In Progress": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  Review: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  Done: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  ACTIVE: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  PLANNING: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  COMPLETED: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  ARCHIVED: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-500 dark:text-neutral-500" },
};

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.Todo;
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        config.bg,
        config.text
      )}
    >
      {status}
    </span>
  );
}
