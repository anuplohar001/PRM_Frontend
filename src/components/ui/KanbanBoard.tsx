import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import IssueCard from "./IssueCard";
import type { Issue } from "../../data/mockData";

const columns = [
  { id: "Todo", title: "To Do", color: "bg-neutral-100 dark:bg-neutral-800" },
  { id: "In Progress", title: "In Progress", color: "bg-blue-500/10" },
  { id: "Review", title: "Review", color: "bg-amber-500/10" },
  { id: "Done", title: "Done", color: "bg-emerald-500/10" },
];

interface KanbanBoardProps {
  issues: Issue[];
}

export default function KanbanBoard({ issues }: KanbanBoardProps) {
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-max">
        {columns.map((col, colIdx) => {
          const colIssues = issues.filter((i) => i.status === col.id);
          return (
            <motion.div
              key={col.id}
              className="w-80 flex-shrink-0"
              onMouseEnter={() => setHoveredCol(col.id)}
              onMouseLeave={() => setHoveredCol(null)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 sticky top-0">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", col.color.replace("/10", ""))} />
                  <h4 className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-medium text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md">
                    {colIssues.length}
                  </span>
                </div>
                <button className={cn("p-1 rounded-md transition-all", hoveredCol === col.id ? "opacity-100" : "opacity-0", "hover:bg-neutral-100 dark:hover:bg-neutral-800")}>
                  <Plus className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-2.5">
                {colIssues.map((issue, i) => (
                  <motion.div
                    key={issue.id}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))}
              </div>

              {/* Quick add */}
              <button className={cn("w-full mt-2 py-2 rounded-md border border-dashed text-[11px] font-medium transition-all", "border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50")}>
                <Plus className="w-3.5 h-3.5 inline mr-1" />
                Add issue
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
