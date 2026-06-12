import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";

interface UserHoverCardProps {
    name: string;
    email?: string;
    role?: string;
    teams?: {
        id: number;
        name: string;
    }[];
    projects?: {
        id: number;
        name: string;
    }[];
    className?: string;
    position?: {
        x: number,
        y: number
    }
}

const CARD_HEIGHT = 220; // approximate card height
const PADDING = 12;



export default function UserHoverCard({
    name,
    email,
    role,
    teams = [],
    projects = [],
    position = {
        x:0,
        y:0
    },
}: UserHoverCardProps) {
    const top = Math.min(
        position.y,
        window.innerHeight - CARD_HEIGHT - PADDING
    );
    return createPortal (
        <div
            className={cn(
                "fixed z-[9999] w-72 rounded-sm border p-2 shadow-xl",
                "bg-white dark:bg-neutral-900 border-neutral-50 dark:border-neutral-500"
            )}
            style={{
                left: position.x,
                top,
            }}
        >
            <div className="min-w-0">
                <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate flex justify-between">
                    {name}

                    <span className="text-xs text-neutral-500">
                        {role}
                    </span>
                </h4>

                <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {email}
                </p>

                <div className="mt-3 space-y-3">
                    <div>
                        <p className="text-[11px] font-medium text-neutral-400 mb-1">
                            Teams
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {teams.length ? (
                                teams.map((team) => (
                                    <span
                                        key={team.id}
                                        className="px-2 py-1 rounded-md text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                    >
                                        {team.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-neutral-500">
                                    No teams
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] font-medium text-neutral-400 mb-1">
                            Projects
                        </p>

                        <div className="flex flex-wrap gap-1">
                            {projects.length ? (
                                projects.map((project) => (
                                    <span
                                        key={project.id}
                                        className="px-2 py-1 rounded-md text-[10px] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                                    >
                                        {project.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-neutral-500">
                                    No projects
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}