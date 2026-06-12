import { motion } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { getUserById, getProjectById, getTeamById } from "../../data/mockData";

interface Issue {
  id: number;
  title: string;
  teamId: number;
  projectId: number;
  priority: string;
  status: string;
  assigneeId: number;
  dueDate: string;
  labels: string[];
}

interface IssueTableProps {
  issues: Issue[];
  showProject?: boolean;
  showTeam?: boolean;
}

export default function IssueTable({ issues, showProject = true, showTeam = true }: IssueTableProps) {
  const headers = ["Issue", "Priority", "Status", ...(showProject ? ["Project"] : []), ...(showTeam ? ["Team"] : []), "Assignee", "Due"];

  return (
    <div >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-200/60 dark:border-neutral-800/60">
              {headers.map((h) => (
                <th key={h} className="text-left text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-neutral-600 transition-colors">
                  <span className="flex items-center gap-1">
                    {h}
                    <ArrowUpDown className="w-3 h-3 opacity-50" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, i) => {
              const assignee = getUserById(issue.assigneeId);
              const project = getProjectById(issue.projectId);
              const team = getTeamById(issue.teamId);
              return (
                <motion.tr
                  key={issue.id}
                  className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 w-[350px]">
                    <span className="text-xs font-medium text-neutral-900 dark:text-white">{issue.title}</span>
                    <div className="flex items-center gap-1 mt-1">
                      {issue.labels.map((l) => (
                        <span key={l} className="text-[9px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">{l}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={issue.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                  {showProject && <td className="px-4 py-3 text-sm text-white">{project?.name}</td>}
                  {showTeam && <td className="px-4 py-3 text-sm text-white">{team?.name}</td>}
                  <td className="px-4 py-3">
                    {assignee && (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-[7px] font-bold">
                          {assignee.avatar}
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">{assignee.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">{issue.dueDate}</td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
