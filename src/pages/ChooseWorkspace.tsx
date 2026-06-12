import Modal from '@/components/CustomModal/Modal'
import { useUpdateLastOrganization } from '@/services/users.service'
import { getUser } from '@/utils/getLocalUser'
import { CheckCircle } from 'lucide-react'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const ChooseWorkspace = () => {
    const user = getUser()
    const location = useLocation();
    const [search, setSearch] = useState("")

    const organizationMemberships =
        location.state?.organizationMemberships || [];

    const filteredWorkspaces =
        organizationMemberships?.filter((membership) =>
            membership.organization.name
                .toLowerCase()
                .includes(search.toLowerCase())
        ) || [];


    const navigate = useNavigate()
    const { updateLastOrganization } = useUpdateLastOrganization()
    const [mode, setMode] = useState(filteredWorkspaces?.length ? "Select" : "Create")
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log(formData);

        // createWorkspace(formData)
    };

    


    const handleSelectWorkspace = (organizationId: number) => {
        updateLastOrganization(
            {
                organizationId,
                userId: Number(user?.id),
            },
            () => {
                localStorage.setItem(
                    "lastOrganizationId",
                    organizationId.toString()
                );
                navigate("/dashboard");
            }
        );
    };
    return (
        <Modal
            open={true}
            onClose={() => { }}
            title={
                filteredWorkspaces?.length > 0
                    ? "Select or Create a Workspace"
                    : "Create Your First Workspace"
            }
            icon={<CheckCircle size={13} className="text-neutral-400" />}
            maxWidth="max-w-xl"
            height="h-[75vh]"
            showCloseBtn={false}
            showCornerBtn={
                filteredWorkspaces?.length > 0 &&
                mode === "Select"
            }
            cornerBtnConfig={{
                label: "Create New",
                onClick: () => setMode("Create"),
            }}
        >
            {mode === "Select" ? (
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto px-8 py-6">
                        <input
                            type="text"
                            placeholder="Search workspaces..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600"
                        />

                        <div className="mt-6 space-y-3">
                            {filteredWorkspaces.map((membership) => (
                                <div
                                    key={membership.organization.id}
                                    className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900/50 p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-white">
                                            {membership.organization.name}
                                        </p>

                                        <p className="truncate text-xs text-neutral-500">
                                            {membership.organization.description ||
                                                "No description"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSelectWorkspace(
                                                membership.organization.id
                                            )
                                        }
                                        className="rounded-md bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-400"
                                    >
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                        >
                            Back to Login
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode("Create")}
                            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                        >
                            Create Workspace
                        </button>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={onSubmit}
                    className="flex flex-col h-full"
                >
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Workspace Name <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                placeholder="e.g. Acme Inc, TechNova Solutions..."
                                className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={onChange}
                                rows={4}
                                placeholder="Describe the workspace purpose..."
                                className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                        >
                            Back to Login
                        </button>

                        <div className="flex items-center gap-3">
                            {filteredWorkspaces?.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setMode("Select")}
                                    className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                                >
                                    Back
                                </button>
                            )}

                            <button
                                type="submit"
                                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
                            >
                                Create Workspace
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </Modal>
    )
}

export default ChooseWorkspace
