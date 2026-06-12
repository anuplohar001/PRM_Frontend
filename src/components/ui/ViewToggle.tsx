import { cn } from "../../lib/utils";
import { List, LayoutGrid, Calendar } from "lucide-react";

interface ViewToggleProps {
  views: { key: string; icon: React.ReactNode; label: string }[];
  active: string;
  onChange: (key: string) => void;
}

export default function ViewToggle({ views, active, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg border bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all",
            active === v.key
              ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          )}
          title={v.label}
        >
          {v.icon}
          <span className="hidden sm:inline">{v.label}</span>
        </button>
      ))}
    </div>
  );
}
