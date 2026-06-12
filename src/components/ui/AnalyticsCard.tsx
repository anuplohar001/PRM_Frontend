import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

interface AnalyticsCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  index?: number;
}

export default function AnalyticsCard({ label, value, change, trend, icon: Icon, index = 0 }: AnalyticsCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border p-4",
        "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-9 h-9 rounded-md flex items-center justify-center bg-neutral-100 dark:bg-neutral-800")}>
          <Icon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </div>
        {change && trend && (
          <div className={cn("flex items-center gap-0.5 text-[11px] font-medium", trend === "up" ? "text-emerald-500" : "text-rose-500")}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-neutral-900 dark:text-white mb-0.5">{value}</div>
      <div className="text-[13px] text-neutral-500">{label}</div>
    </motion.div>
  );
}
