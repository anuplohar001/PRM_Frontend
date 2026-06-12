import { cn } from "../../lib/utils";
import { getUserById } from "../../data/mockData";

interface AvatarGroupProps {
  userIds: number[];
  max?: number;
  size?: "sm" | "md";
}

export default function AvatarGroup({ userIds, max = 4, size = "sm" }: AvatarGroupProps) {
  const visible = userIds.slice(0, max);
  const remaining = userIds.length - max;

  const sizeClasses = size === "sm" ? "w-6 h-6 text-[8px]" : "w-8 h-8 text-[10px]";

  return (
    <div className="flex -space-x-1.5">
      {visible.map((id) => {
        const user = getUserById(id);
        return (
          <div
            key={id}
            className={cn(
              "rounded-lg flex items-center justify-center font-bold ring-2 ring-white dark:ring-neutral-900",
              sizeClasses,
              "bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 text-white"
            )}
            title={user?.name}
          >
            {user?.avatar}
          </div>
        );
      })}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-lg flex items-center justify-center font-medium ring-2 ring-white dark:ring-neutral-900 bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300",
            sizeClasses
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
