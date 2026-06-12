import { useEffect, useRef, useState } from "react";
import UserHoverCard from "./UserHoverCard";
import { User } from "@/services/hooks/types";

interface UserSelectModalProps {
    open: boolean;
    onClose: () => void;
    search: string;
    onSearchChange: (value: string) => void;
    users: User[];
    selectedIds: number[];
    onSelect: (user: User) => void;
    placeholder?: string;
    emptyMessage?: string;
    footer?: React.ReactNode;
}

const UserSelectModal = ({
    open,
    onClose,
    search,
    onSearchChange,
    users,
    selectedIds,
    onSelect,
    placeholder = "Search users...",
    emptyMessage = "No users found",
    footer,
}: UserSelectModalProps) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [hoveredUser, setHoveredUser] = useState<User | null>(null);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener(
                "mousedown",
                handleOutsideClick
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute top-10 right-0 w-96 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl p-3 z-50"
        >
            <input
                type="text"
                placeholder={placeholder}
                value={search}
                onChange={(e) =>
                    onSearchChange(e.target.value)
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent outline-none text-sm"
            />

            <div className="mt-3 space-y-1 max-h-80 overflow-y-auto">
                {users.length > 0 ? (
                    users.map((user) => {
                        const selected =
                            selectedIds.includes(user.id);

                        return (
                            <div
                                key={user.id}
                                className="group relative"
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();

                                    setPosition({
                                        x: rect.left - 310,
                                        y: rect.top - 60,
                                    });

                                    setHoveredUser(user || null);
                                }}

                                onMouseLeave={() => {
                                    setHoveredUser(null);
                                }}
                            >
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => onSelect(user)}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-left"
                                >
                                    <div className="mr-2">
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() =>
                                                onSelect(user)
                                            }
                                            onClick={(e) =>
                                                e.stopPropagation()
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between w-full">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                            {user.name}
                                        </p>

                                        <p className="text-xs text-neutral-500">
                                            {user.role}
                                        </p>
                                    </div>
                                </button>

                            </div>
                        );
                    })
                ) : (
                    <div className="text-sm text-neutral-500 text-center py-4">
                        {emptyMessage}
                    </div>
                )}

                {hoveredUser && (
                    <UserHoverCard
                        name={hoveredUser.name}
                        email={hoveredUser?.email}
                        role={hoveredUser?.role}
                        teams={
                            hoveredUser?.teamMemberships?.map((membership) => ({
                                id: membership.team.id,
                                name: membership.team.name,
                            })) || []
                        }
                        projects={
                            hoveredUser?.projectMemberships?.map((membership) => ({
                                id: membership.project.id,
                                name: membership.project.name,
                            })) || []
                        }
                        position={position}
                    />
                )}
            </div>

            {footer && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default UserSelectModal;