import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, Clock, AlertTriangle, FolderKanban, Users, ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";
import AnalyticsCard from "../components/ui/AnalyticsCard";
import IssueCard from "../components/ui/IssueCard";
import { projects, teams, issues, activities } from "../data/mockData";

export default function Dashboard() {
  
  const recentIssues = issues.slice(0, 6);
  const activeProjects = projects.filter((p) => p.status === "ACTIVE").slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Home</h1>
        <p className="text-xs text-neutral-500 mt-1">Your workspace overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <AnalyticsCard label="Open Issues" value="42" change="+5" trend="down" icon={AlertTriangle} index={0} />
        <AnalyticsCard label="In Progress" value="18" change="+3" trend="up" icon={Clock} index={1} />
        <AnalyticsCard label="Completed" value="24" change="+12%" trend="up" icon={CheckCircle2} index={2} />
        <AnalyticsCard label="Active Projects" value="3" icon={FolderKanban} index={3} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Issues */}
        <div className="xl:col-span-2 space-y-5">
          <div className={cn("rounded-2xl border", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Issues</h3>
              <Link to="/my-issues" className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div className={cn("rounded-2xl border", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Active Projects</h3>
              <Link to="/projects" className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="p-5 space-y-3">
              {activeProjects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`} className={cn("flex items-center gap-4 p-3 rounded-md border transition-all", "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700")}>
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <FolderKanban className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-900 dark:text-white">{project.name}</div>
                    <div className="text-[10px] text-neutral-500">{project.openIssues} open issues • {project.teamCount} teams</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", project.progress === 100 ? "bg-emerald-500" : "bg-blue-500")} style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-[10px] text-neutral-500">{project.progress}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* My Teams */}
          <div className={cn("rounded-2xl border", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>
            <div className="px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">My Teams</h3>
            </div>
            <div className="p-5 space-y-3">
              {teams.slice(0, 4).map((team) => (
                <Link key={team.id} to={`/teams/${team.id}/board`} className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-neutral-900 dark:text-white group-hover:underline">{team.name}</div>
                    <div className="text-[10px] text-neutral-500">{team.projectName}</div>
                  </div>
                  <div className="text-[10px] text-neutral-400">{team.openIssues} issues</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className={cn("rounded-2xl border", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60")}>
            <div className="px-5 py-4 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Activity</h3>
            </div>
            <div className="p-5 space-y-3">
              {activities.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-600 dark:to-neutral-800 flex items-center justify-center text-white text-[7px] font-bold flex-shrink-0 mt-0.5">U{a.userId}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      <span className="font-medium text-neutral-900 dark:text-white">User {a.userId}</span>{" "}
                      {a.action}{" "}
                      <span className="font-medium text-neutral-900 dark:text-white">{a.target}</span>
                    </p>
                    <span className="text-[10px] text-neutral-400">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
