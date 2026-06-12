import { MessageSquare, Paperclip } from "lucide-react";
import { cn } from "../../lib/utils";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import { getUserById, getProjectById, getTeamById } from "../../data/mockData";

interface IssueCardProps {
  issue: {
    id: number;
    title: string;
    teamId: number;
    projectId: number;
    priority: string;
    status: string;
    assigneeId: number;
    dueDate: string;
    labels: string[];
    comments: number;
    attachments: number;
  };
  compact?: boolean;
}

export default function IssueCard({ issue, compact = false }: IssueCardProps) {
  const assignee = getUserById(issue.assigneeId);
  const project = getProjectById(issue.projectId);
  const team = getTeamById(issue.teamId);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700")}>
        <PriorityBadge priority={issue.priority} />
        <span className="flex-1 text-xs text-neutral-900 dark:text-white truncate">{issue.title}</span>
        <StatusBadge status={issue.status} />
      </div>
    );
  }

  return (
    <div className={cn("group p-4 rounded-md border transition-all cursor-pointer", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm")}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <PriorityBadge priority={issue.priority} />
        <StatusBadge status={issue.status} />
      </div>
      <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2 leading-snug">{issue.title}</h4>
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {issue.labels.map((l) => (
          <span key={l} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500">{l}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project && (
            <span className="text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 px-1.5 py-0.5 rounded">{project.name}</span>
          )}
          {team && (
            <span className="text-[10px] text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 px-1.5 py-0.5 rounded">{team.name}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {(issue.comments > 0 || issue.attachments > 0) && (
            <div className="flex items-center gap-2 text-neutral-400">
              {issue.comments > 0 && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <MessageSquare className="w-3 h-3" />
                  {issue.comments}
                </span>
              )}
              {issue.attachments > 0 && (
                <span className="flex items-center gap-0.5 text-[10px]">
                  <Paperclip className="w-3 h-3" />
                  {issue.attachments}
                </span>
              )}
            </div>
          )}
          {assignee && (
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-[8px] font-bold" title={assignee.name}>
              {assignee.avatar}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
