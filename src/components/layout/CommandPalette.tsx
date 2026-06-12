import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, FolderKanban, CheckSquare, Users, Calendar, BarChart3, Sparkles, Settings, ArrowRight, Home, Activity } from "lucide-react";
import { cn } from "../../lib/utils";

const commands = [
  { id: "nav1", title: "Home", subtitle: "Navigation", icon: Home, category: "Navigation", action: () => "/dashboard" },
  { id: "nav2", title: "My Issues", subtitle: "Navigation", icon: CheckSquare, category: "Navigation", action: () => "/my-issues" },
  { id: "nav3", title: "Projects", subtitle: "Navigation", icon: FolderKanban, category: "Navigation", action: () => "/projects" },
  { id: "nav4", title: "Teams", subtitle: "Navigation", icon: Users, category: "Navigation", action: () => "/teams" },
  { id: "nav5", title: "Activity", subtitle: "Navigation", icon: Activity, category: "Navigation", action: () => "/activity" },
  { id: "nav6", title: "Settings", subtitle: "Navigation", icon: Settings, category: "Navigation", action: () => "/settings" },
  { id: "p1", title: "Website Redesign", subtitle: "Project", icon: FolderKanban, category: "Projects", action: () => "/projects/1" },
  { id: "p2", title: "Mobile App v2.0", subtitle: "Project", icon: FolderKanban, category: "Projects", action: () => "/projects/2" },
  { id: "p3", title: "API Platform", subtitle: "Project", icon: FolderKanban, category: "Projects", action: () => "/projects/3" },
  { id: "t1", title: "Design system tokens", subtitle: "Issue • Alice Chen", icon: CheckSquare, category: "Issues", action: () => "/my-issues" },
  { id: "t2", title: "iOS onboarding flow", subtitle: "Issue • Bob Martinez", icon: CheckSquare, category: "Issues", action: () => "/my-issues" },
  { id: "t3", title: "Performance audit", subtitle: "Issue • Diana Ross", icon: CheckSquare, category: "Issues", action: () => "/my-issues" },
  { id: "team1", title: "Design System", subtitle: "Team", icon: Users, category: "Teams", action: () => "/teams/1/board" },
  { id: "team2", title: "Frontend Core", subtitle: "Team", icon: Users, category: "Teams", action: () => "/teams/2/board" },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = query.trim()
    ? commands.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, typeof commands>);

  const flatList = Object.values(grouped).flat();

  useEffect(() => { setSelectedIndex(0); }, [query]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 50); else setQuery(""); }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => (i + 1) % flatList.length); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => (i - 1 + flatList.length) % flatList.length); }
      if (e.key === "Enter") {
        e.preventDefault();
        const selected = flatList[selectedIndex];
        if (selected) { navigate(selected.action()); onClose(); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, flatList, selectedIndex, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/20 dark:bg-black/40 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, y: -20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.96 }} transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }} onClick={(e) => e.stopPropagation()} className={cn("w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl", "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800")}>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800">
              <Search className="w-5 h-5 text-neutral-400" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects, issues, teams, or navigate..." className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none" />
              <kbd className="px-2 py-1 rounded-md text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{category}</div>
                  {items.map((cmd) => {
                    const globalIdx = flatList.indexOf(cmd);
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button key={cmd.id} onMouseEnter={() => setSelectedIndex(globalIdx)} onClick={() => { navigate(cmd.action()); onClose(); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors", isSelected ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50")}>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", isSelected ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500")}>
                          <cmd.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white truncate">{cmd.title}</div>
                          <div className="text-xs text-neutral-500">{cmd.subtitle}</div>
                        </div>
                        {isSelected && <ArrowRight className="w-4 h-4 text-neutral-400" />}
                      </button>
                    );
                  })}
                </div>
              ))}
              {flatList.length === 0 && <div className="px-4 py-8 text-center text-sm text-neutral-500">No results found</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
