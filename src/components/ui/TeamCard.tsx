import { motion } from "framer-motion";
import { Users, FolderKanban } from "lucide-react";
import { cn } from "../../lib/utils";
import StatusBadge from "./StatusBadge";
import AvatarGroup from "./AvatarGroup";

interface Team {
  id: number;
  name: string;
  projectName: string;
  members: number[];
  openIssues: number;
  sprintProgress: number;
  status: string;
}

interface TeamCardProps {
  team: Team;
  index?: number;
}

export default function TeamCard({ team, index = 0 }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={cn(
        "group rounded-2xl border p-5 transition-all cursor-pointer",
        "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60",
        "hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Users className="w-4 h-4 text-neutral-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{team.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FolderKanban className="w-3 h-3 text-neutral-400" />
              <span className="text-[11px] text-neutral-500">{team.projectName}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={team.status} />
      </div>

      {/* Sprint progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-neutral-500">Sprint Progress</span>
          <span className="text-[10px] font-semibold text-neutral-900 dark:text-white">{team.sprintProgress}%</span>
        </div>
        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${team.sprintProgress}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.06 }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <AvatarGroup userIds={team.members} max={4} />
        <span className="text-[10px] text-neutral-500">{team.openIssues} open issues</span>
      </div>
    </motion.div>
  );
}
