import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Bell, Plus, Moon, Sun, ChevronDown, Command, LogOut, Settings, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { getUser } from "@/utils/getLocalUser";

interface TopbarProps {
  onOpenCommandPalette: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function Topbar({ onOpenCommandPalette, theme, onToggleTheme }: TopbarProps) {


  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const user = getUser()

  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileRef.current &&
        !(profileRef.current as HTMLDivElement).contains(target)
      ) {
        setProfileOpen(false);
      }

      if (
        workspaceRef.current &&
        !workspaceRef.current.contains(target)
      ) {
        setWorkspaceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className={cn("h-14 flex items-center justify-between px-5 border-b sticky top-0 z-30", "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl", "border-neutral-400/60 dark:border-neutral-400/60")}>
      {/* Left: Breadcrumb area + Search */}
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onOpenCommandPalette}
          className={cn("flex items-center gap-2.5 px-3.5 py-1.5 rounded-md text-sm w-72 transition-all", "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700", "border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700")}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left text-xs">Search anything...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-400">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Create Issue */}
        <button className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all", "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90")}>
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Issue</span>
        </button>



        <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />

        {/* Workspace switch */}
        <div
          ref={workspaceRef}
          className="relative hidden md:block"
        >
          <button
            onClick={() => {
              setWorkspaceOpen(!workspaceOpen);
              setProfileOpen(false);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[12px] font-bold">
              {user?.lastOrganization?.name?.charAt(0)}
            </div>

            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {user?.lastOrganization?.name}
            </span>

            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          <AnimatePresence>
            {workspaceOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-72 rounded-md border shadow-xl overflow-hidden z-50 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Workspaces
                  </p>

                  <button
                    className="rounded-mg bg-neutral-800 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-700"
                    onClick={() => {
                      setWorkspaceOpen(false);
                      navigate("/organizations/create");
                    }}
                  >
                    Create New
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto py-1">
                  {user?.organizationMemberships?.map(
                    (membership) => {
                      const org = membership.organization;

                      const isCurrent =
                        org.id ===
                        user?.lastOrganization?.id;

                      return (
                        <button
                          key={org.id}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                            isCurrent
                              ? "bg-indigo-50 dark:bg-indigo-500/10"
                              : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          )}
                          onClick={() => {
                            // TODO:
                            // call updateLastOrganization API
                            // update localStorage
                            // navigate/reload data

                            setWorkspaceOpen(false);
                          }}
                        >

                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium text-neutral-900 dark:text-white">
                              {org.name}
                            </p>
                          </div>

                          {isCurrent && (
                            <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500 text-white">
                              Current
                            </span>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Profile */}
        <div ref={profileRef}>
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-500 dark:to-neutral-700 flex items-center justify-center text-white text-[12px] font-bold">
                {user?.name.charAt(0)}
              </div>
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div className={cn("absolute right-0 top-full mt-2 w-52 rounded-md border shadow-xl overflow-hidden z-50", "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")}>
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {user?.id} {" "} {user?.name}
                    </div>
                    <div className="text-[12px] text-neutral-500">
                      {user?.email}
                    </div>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: User, label: "Profile", to: "#" },
                      { icon: Settings, label: "Settings", to: "/settings" },
                    ].map((item) => (
                      <Link key={item.label} to={item.to} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-neutral-200 dark:border-neutral-800 my-1" />
                    <button

                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-rose-500 transition-colors w-full text-left"

                      onClick={() => navigate("/login")}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
