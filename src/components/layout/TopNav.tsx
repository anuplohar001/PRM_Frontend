import { Search, Bell, Moon, Sun, Command } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface TopNavProps {
  onOpenCommandPalette: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function TopNav({ onOpenCommandPalette, theme, onToggleTheme }: TopNavProps) {
  return (
    <header
      className={cn(
        "h-16 flex items-center justify-between px-6 border-b sticky top-0 z-30",
        "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl",
        "border-neutral-200/60 dark:border-neutral-800/60"
      )}
    >
      {/* Search */}
      <button
        onClick={onOpenCommandPalette}
        className={cn(
          "flex items-center gap-2.5 px-4 py-2 rounded-md text-sm w-80 transition-all duration-200",
          "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700",
          "border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-400">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTheme}
          className={cn(
            "p-2.5 rounded-md transition-all duration-200",
            "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {theme === "light" ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
          </motion.div>
        </button>

        <button
          className={cn(
            "relative p-2.5 rounded-md transition-all duration-200",
            "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
        >
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white dark:ring-neutral-900" />
        </button>

        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
            JD
          </div>
          <span className="text-sm font-medium text-neutral-900 dark:text-white hidden sm:block">John Doe</span>
        </button>
      </div>
    </header>
  );
}
