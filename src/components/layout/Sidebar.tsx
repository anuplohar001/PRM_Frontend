import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, CheckSquare, FolderKanban, Users, Activity, Settings, Orbit, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

const menuItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: CheckSquare, label: "My Issues", href: "/my-issues" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Users, label: "Teams", href: "/teams" },
  { icon: Activity, label: "Activity", href: "/activity" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({
  collapsed = false,
  setCollapsed
}) {


  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("fixed left-0 top-0 h-screen z-40 flex flex-col border-r", "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl", "border-neutral-200/60 dark:border-neutral-400/60")}
    >
      <div className="flex items-center h-14 px-3.5 border-b border-neutral-200/60 dark:border-neutral-400/60">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center flex-shrink-0">
            <Orbit className="w-3.5 h-3.5 text-white dark:text-neutral-900" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }} className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
                Orbit
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-5 overflow-hidden">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-150 group relative",
                active
                  ? "bg-neutral-900 text-white dark:bg-neutral-700 dark:text-white"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
            >
              <item.icon className="w-[17px] h-[17px] flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.15 }} className="whitespace-nowrap text-sm">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center justify-center w-full py-2 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
