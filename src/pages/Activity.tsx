import { motion } from "framer-motion";
import { Activity as ActivityIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { activities } from "../data/mockData";

export default function Activity() {
  return (
    <motion.div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Activity</h1>
        <p className="text-xs text-neutral-500 mt-1">Global activity feed across all projects and teams</p>
      </div>

      <div>
        <div className="p-5 space-y-4">
          {activities.map((a, i) => (
            <motion.div key={a.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0 mt-0.5">U{a.userId}</div>
              <div className="flex-1 min-w-0 pb-4 border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 last:pb-0">
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-medium text-neutral-900 dark:text-white">User {a.userId}</span>{" "}
                  {a.action}{" "}
                  <span className="font-medium text-neutral-900 dark:text-white">{a.target}</span>
                </p>
              </div>
                <span className="text-[12px] text-neutral-400 mt-0.5 block">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
