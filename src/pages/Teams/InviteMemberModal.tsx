import { useMemo, useState } from "react";
import { UserPlus } from "lucide-react";

import Modal from "@/components/CustomModal/Modal";
import { useUsers } from "@/services/users.service";
import { useAddOrganizationMember } from "@/services/organization.service";

interface InviteMemberModalProps {
    open: boolean;
    onClose: () => void;
    onInvite?: () => void;
}

const InviteMemberModal = ({
    open,
    onClose,
    onInvite,
}: InviteMemberModalProps) => {



    const organization = localStorage.getItem("lastOrganizationId")

    const { addOrganizationMember, loading: inviting } = useAddOrganizationMember();

    const [search, setSearch] = useState("");

    const { users, loading, refetchUsers } = useUsers();

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;

        return users.filter(
            (user) =>
                user?.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                user?.email
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        );
    }, [users, search]);

    const handleInvite = (memberId: number) => {
        addOrganizationMember(
            {
                organizationId: Number(organization),
                memberId,
            },
            () => {

                onClose();
                refetchUsers()
                onInvite?.()
            }
        );
    };

    return (
        <Modal
            
            open={open}
            onClose={onClose}
            title="Invite Members"
            icon={<UserPlus size={13} className="text-neutral-400" />}
            maxWidth="max-w-xl"
            height="h-[75vh]"
        >
            <div className="p-6 flex flex-col h-full">
                {/* Search */}
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
                />

                {/* Users */}
                <div className="mt-4 flex-1 overflow-y-auto space-y-2">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-sm text-neutral-500">
                                Loading users...
                            </p>
                        </div>
                    ) : filteredUsers?.length > 0 ? (
                        filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {user.name}
                                    </p>

                                    <p className="truncate text-xs text-neutral-500">
                                        {user.email}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleInvite(Number(user.id))}
                                    className="rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400"
                                >
                                    Invite
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-32">
                            <p className="text-sm text-neutral-500">
                                No users found
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 flex justify-end border-t border-neutral-800 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default InviteMemberModal;