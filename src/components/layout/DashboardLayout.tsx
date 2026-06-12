import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { useCommandPalette } from "../../hooks/useCommandPalette";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface DashboardLayoutProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function DashboardLayout({ theme, onToggleTheme }: DashboardLayoutProps) {
  const { isOpen, open, close } = useCommandPalette();
  const location = useLocation();
  const [sidebarCollapse, setSidebarCollapse] = useState(false)
  const isDashboardRoute = !location.pathname.match(/^\/(login|signup)$/);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {isDashboardRoute &&
        <Sidebar
          collapsed={sidebarCollapse}
          setCollapsed={setSidebarCollapse}
        />
      }

      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          isDashboardRoute &&
          (sidebarCollapse
            ? "lg:ml-16 ml-16"
            : "lg:ml-55 ml-16")
        )}
      >
        {isDashboardRoute && (
          <Topbar
            onOpenCommandPalette={open}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />
        )}

        <main
          className={cn(
            "p-5",
            isDashboardRoute && ""
          )}
        >
          <Outlet />
        </main>
      </div>

      <CommandPalette
        isOpen={isOpen}
        onClose={close}
      />
    </div>
  );
}
