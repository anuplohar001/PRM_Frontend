import { motion } from "framer-motion";
import { User, Bell, Palette, Shield, Globe, Keyboard } from "lucide-react";
import { cn } from "../lib/utils";

const settingsGroups = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", description: "Update your name, email, and avatar" },
      { icon: Bell, label: "Notifications", description: "Email, push, and in-app notifications" },
      { icon: Shield, label: "Security", description: "Password, 2FA, and session management" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Palette, label: "Appearance", description: "Theme, density, and accent color" },
      { icon: Globe, label: "Language", description: "Interface language and date format" },
      { icon: Keyboard, label: "Keyboard Shortcuts", description: "Customize your command palette" },
    ],
  },
];

export default function Settings() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-8">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-xs text-neutral-500 mt-1">Configure your workspace and preferences</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-4">{group.title}</h2>
            <div className="space-y-3">
              {group.items.map((item, i) => (
                <motion.button key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={cn("w-full flex items-center gap-4 p-4 rounded-md border text-left transition-all", "bg-white dark:bg-neutral-900 border-neutral-200/60 dark:border-neutral-800/60 hover:border-neutral-300 dark:hover:border-neutral-700")}>
                  <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-neutral-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-neutral-500">{item.description}</div>
                  </div>
                  <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full relative flex-shrink-0">
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
