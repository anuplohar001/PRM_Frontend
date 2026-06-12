import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", "rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>
      <div className="w-12 h-12 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
}
