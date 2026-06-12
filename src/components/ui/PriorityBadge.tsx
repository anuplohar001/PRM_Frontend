import { cn } from "../../lib/utils";

const priorityConfig: Record<string, { dot: string; text: string }> = {
  HIGH: { dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
  MEDIUM: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  LOW: { dot: "bg-neutral-300 dark:bg-neutral-600", text: "text-neutral-500 dark:text-neutral-400" },
};

interface PriorityBadgeProps {
  priority: string;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.LOW;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      <span className={cn("text-[10px] font-medium", config.text)}>{priority}</span>
    </span>
  );
}
