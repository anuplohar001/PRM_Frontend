import { motion } from "framer-motion";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { cn } from "../../lib/utils";
import StatusBadge from "./StatusBadge";
import AvatarGroup from "./AvatarGroup";
import { getUserById } from "../../data/mockData";

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  teamCount: number;
  openIssues: number;
  dueDate: string;
  ownerId: number;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const owner = getUserById(project.ownerId);

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
            <FolderKanban className="w-4 h-4 text-neutral-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{project.name}</h3>
            <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{project.description}</p>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-neutral-500">Progress</span>
          <span className="text-[10px] font-semibold text-neutral-900 dark:text-white">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.06 }}
            className={cn("h-full rounded-full", project.progress === 100 ? "bg-emerald-500" : "bg-blue-500")}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-neutral-500">{project.teamCount} teams</span>
          <span className="w-px h-2.5 bg-neutral-300 dark:bg-neutral-700" />
          <span className="text-[10px] text-neutral-500">{project.openIssues} issues</span>
        </div>
        {owner && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-neutral-400">Owner</span>
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-[7px] font-bold">
              {owner.avatar}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
