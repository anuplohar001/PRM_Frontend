import { useState } from "react";
import { motion } from "framer-motion";
import { Search, X, MessageSquare, AtSign } from "lucide-react";
import { cn } from "../../lib/utils";
import { getIssuesByAssignee } from "../../data/mockData";
import IssueTable from "../../components/ui/IssueTable";
import EmptyState from "../../components/ui/EmptyState";

const tabs = [
  { key: "assigned", label: "Assigned", href: "/my-issues" },
  { key: "created", label: "Created", href: "/my-issues/created" },
  { key: "mentioned", label: "Mentioned", href: "/my-issues/mentioned" },
  { key: "completed", label: "Completed", href: "/my-issues/completed" },
];
const mentions = [
  { id: 1, issue: "Design system tokens", comment: "@alice can you review the color palette?", author: "Bob Martinez", time: "15 min ago" },
  { id: 2, issue: "iOS onboarding flow", comment: "@alice the flow looks great, just one tweak needed", author: "Charlie Kim", time: "2 hours ago" },
  { id: 3, issue: "Performance optimization", comment: "@alice thanks for the PR review!", author: "Frank Lee", time: "Yesterday" },
];

export default function MyIssuesAssigned() {

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("assigned");
  const myIssues = getIssuesByAssignee(1);
  const createdIssues = myIssues.filter((i) => i.id % 3 === 0);



  return (
    <motion.div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">My Issues</h1>
        <p className="text-xs text-neutral-500 mt-1">Your personal productivity inbox</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-0.5 rounded-md w-fit">
        {tabs.map((tab) => (
          <button
            onClick={() => setActiveTab(tab.key)}
            key={tab.key}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Search Issues..."
          className={cn(
            "w-full pl-9 pr-8 py-2 rounded-lg text-xs border outline-none transition-all",
            "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-800",
            "text-neutral-900 dark:text-white placeholder:text-neutral-400",
            "focus:border-neutral-400 dark:focus:border-neutral-600"
          )}
        />
        {query && (
          <button onClick={() => { setQuery("") }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === "assigned" && (
        <IssueTable issues={myIssues} showProject showTeam />
      )}
      {activeTab === "created" && (
        <IssueTable issues={createdIssues} showProject showTeam />
      )}
      {activeTab === "mentioned" &&
        (mentions.length === 0 ? (
          <EmptyState
            icon={<AtSign className="w-5 h-5 text-neutral-400" />}
            title="No mentions yet"
            description="When someone mentions you in a comment, it will appear here."
          />
        ) : (
          <div className="space-y-3">
            {mentions.map((m, i) => (
              <motion.div
                key={m.id}
                className={cn(
                  "p-4 rounded-md border transition-all cursor-pointer",
                  "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <AtSign className="w-4 h-4 text-blue-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-neutral-900 dark:text-white">
                        {m.issue}
                      </span>

                      <span className="text-[10px] text-neutral-400">
                        {m.time}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                      {m.comment}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-neutral-400" />

                      <span className="text-[10px] text-neutral-500">
                        {m.author}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}

      {activeTab === "completed" && (
        <IssueTable issues={createdIssues} showProject showTeam />
      )}
    </motion.div>
  );
}
