import React from 'react'
import Modal from "@/components/CustomModal/Modal";
import { Project, Team } from '@/services/hooks/types';
import { Check, Folder, Users } from 'lucide-react';


export interface ProjectFormData {
    name: string
    description: string
    teams: Team[]
}

interface ProjectFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (e: React.SubmitEvent) => void;

    mode: "Create" | "Edit";

    formData: ProjectFormData;

    errors: {
        name?: string;
        teamIds?: string;
    };

    teams: Team[];

    loading?: boolean;

    onChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => void;

    toggleTeam: (teamId: number) => void;
}




const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
    open,
    onClose,
    onSubmit,
    mode = "Create",
    formData,
    errors,
    teams,
    loading = false,
    onChange,
    toggleTeam,
}) => {



    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
                title="New Project"
                icon={<Folder size={13} className="text-neutral-400" />}
                maxWidth="max-w-3xl"
            >
                {/* Body */}
                <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

                        {/* Project Name */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Project Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChange}
                                placeholder="e.g. Website Redesign, Q3 Campaign…"
                                className={`w-full rounded-md border bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none transition ${errors.name
                                    ? "border-red-500/60 focus:border-red-500"
                                    : "border-neutral-800 focus:border-neutral-600"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-[11px] text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData?.description}
                                onChange={onChange}
                                rows={4}
                                placeholder="Write a description, a project brief, or collect ideas..."
                                className="w-full resize-none rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-neutral-600 transition"
                            />
                        </div>

                        {/* Teams */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                                    Assign Teams <span className="text-red-500">*</span>
                                </label>
                                {formData.teams.length > 0 && (
                                    <span className="text-[11px] text-indigo-400 font-medium">
                                        {formData.teams.length} selected
                                    </span>
                                )}
                            </div>

                            <div
                                className={`rounded-md border overflow-hidden transition ${errors.teamIds ? "border-red-500/50" : "border-neutral-800"
                                    }`}
                            >
                                {teams.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-neutral-600">
                                        <Users size={20} />
                                        <p className="text-xs">No teams available</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-neutral-800/60 max-h-52 overflow-y-auto">
                                        {teams.map((team) => {
                                            const checked = formData.teams.some(
                                                (selectedTeam) => selectedTeam.id === team.id
                                            );
                                            return (
                                                <li key={team.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleTeam(team.id)}
                                                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${checked
                                                            ? "bg-indigo-500/10"
                                                            : "hover:bg-neutral-800/40"
                                                            }`}
                                                    >
                                                        {/* Avatar */}
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-semibold text-neutral-300 uppercase">
                                                            {team.name?.charAt(0)}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-neutral-200 truncate">
                                                                {team.name}
                                                            </p>
                                                            {team.createdBy?.name && (
                                                                <p className="text-[11px] text-neutral-500 truncate">
                                                                    by {team.createdBy.name}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Checkbox */}
                                                        <div
                                                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${checked
                                                                ? "border-indigo-500 bg-indigo-500"
                                                                : "border-neutral-700 bg-neutral-900"
                                                                }`}
                                                        >
                                                            {checked && <Check size={10} className="text-white" />}
                                                        </div>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>

                            {errors.teamIds && (
                                <p className="text-[11px] text-red-400">{errors.teamIds}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 border-t border-neutral-800 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating…" : `${mode} Project`}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default ProjectFormModal
