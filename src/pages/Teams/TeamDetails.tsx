import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FolderKanban,
    CheckSquare,
    Users,
    Settings,
    Plus,
    Kanban,
    Folder,
    Users2,
} from "lucide-react";

import { cn } from "../../lib/utils";
import {
    getTeamById,
    getIssuesByTeam,
    getUserById,
} from "../../data/mockData";
import IssueTable from "../../components/ui/IssueTable";
import KanbanBoard from "../../components/ui/KanbanBoard";
import { TeamDetails, useAddTeamMember, useAssignTeam, useAvailableMembersList, useCreateTeam, useTeamDetails, useUpdateTeamName } from "@/services/team.service";
import InviteMemberModal from "./InviteMemberModal";
import DropdownSelectModal from "@/components/DropdownModal";
import useProjects, { useManageProjectTeam } from "@/services/project.service";

const tabs = [
    { key: "board", label: "Kanban", icon: Kanban },
    { key: "issues", label: "Issues", icon: CheckSquare },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "members", label: "Members", icon: Users },
    { key: "settings", label: "Settings", icon: Settings },
];

export default function TeamDetail() {

    const { id } = useParams();
    const navigate = useNavigate()
    const teamIssues = getIssuesByTeam(Number(id));


    const { addTeamMember, loading: addingMember } = useAddTeamMember();
    const { teamDetails, loading, refetchTeamDetails } = useTeamDetails()
    const { members: availableMembers, loading: membersLoading, refetchMembers } = useAvailableMembersList()
    const { projects, fetchingAllProjects, refetchProjects } = useProjects()

    const { manageProjectTeam } = useManageProjectTeam()

    const { updateTeamName } = useUpdateTeamName();



    const teamMembers = teamDetails?.teamMembers?.map(
        (teamMember) => teamMember.member
    ) || []
    const finalAvailableMembers = availableMembers?.map(
        (teamMember) => teamMember.user
    ) || []


    const [team, setTeam] = useState<TeamDetails>();
    const [originalName, setOriginalName] = useState("");
    const allMembers = [...teamMembers, ...finalAvailableMembers]
    const [showInviteMemberModal, setShowInviteMemberModal] = useState(false)
    const [activeTab, setActiveTab] = useState("board");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([])
    const [selectedProject, setSelectedProject] = useState<number[]>([])
    const [showTeamBox, setShowTeamBox] = useState(false);
    const [showProjectBox, setShowProjectBox] = useState(false);
    const [searchTeam, setSearchTeam] = useState("");
    const teamBoxRef = useRef(null);


    useEffect(() => {
        if (teamMembers && teamMembers.length > 0) {
            setSelectedMembers(teamMembers.map((member) => Number(member?.id)))
        }

        if (teamDetails?.team.projects && teamDetails?.team.projects.length) {
            setSelectedProject(teamDetails?.team?.projects.map((pr) => Number(pr.project.id)))
        }

        if (teamDetails?.team) {
            setTeam(teamDetails.team);
            setOriginalName(teamDetails.team.name);
        }
    }, [teamDetails])


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                teamBoxRef.current &&
                !teamBoxRef.current.contains(event.target)
            ) {
                setShowTeamBox(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const handleToggleMember = (memberId: number) => {
        if (selectedMembers.includes(memberId)) {
            setSelectedMembers((prev) =>
                prev.filter((id) => id !== memberId)
            );
            return;
        }

        setSelectedMembers((prev) => [...prev, memberId]);

        addTeamMember(
            {
                teamId: Number(id),
                memberId,
            },
            () => {
                refetchTeamDetails?.()
                refetchMembers?.()
            },
            () =>
                setSelectedMembers((prev) =>
                    prev.filter((id) => id !== memberId)
                )
        );
    };


    const handleToggleProject = (projectId: number) => {
        const isSelected = selectedProject.includes(projectId);

        if (isSelected) {
            setSelectedProject((prev) =>
                prev.filter((id) => id !== projectId)
            );

            manageProjectTeam(
                {
                    projectId,
                    teamId: Number(id),
                    action: "detach",
                },
                () => { },
                () => {
                    setSelectedProject((prev) => [
                        ...prev,
                        projectId,
                    ]);
                }
            );

            return;
        }

        setSelectedProject((prev) => [...prev, projectId]);

        manageProjectTeam(
            {
                projectId,
                teamId: Number(id),
                action: "assign",
            },
            () => { },
            () => {
                setSelectedProject((prev) =>
                    prev.filter((id) => id !== projectId)
                );
            }
        );
    };






    const handleTeamNameBlur = () => {
        if (!team) return;

        const newName = team.name.trim();

        if (!newName || newName === originalName) {
            setTeam((prev) =>
                prev
                    ? {
                        ...prev,
                        name: originalName,
                    }
                    : prev
            );
            return;
        }

        updateTeamName(
            {
                teamId: team.id,
                name: newName,
            },
            () => {
                setOriginalName(newName);
            },
            () => {
                setTeam((prev) =>
                    prev
                        ? {
                            ...prev,
                            name: originalName,
                        }
                        : prev
                );
            }
        );
    };



    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* Header */}
            <div className="p-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-md border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                            <Users2 className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                        </div>

                        <div>
                            <input
                                type="text"
                                value={team?.name || ""}
                                onChange={(e) =>
                                    setTeam((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                name: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                onBlur={handleTeamNameBlur}
                                className="project-title-input"
                            />

                            <p className="text-sm text-neutral-500 mt-1">
                                {/* {teamDetails?.team?.} */}
                                Team Description
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-t border-neutral-800/40">
                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                                activeTab === tab.key
                                    ? "border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"

                                    : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {activeTab === "board" && (<KanbanBoard issues={teamIssues} />)}

            {/* Issues */}
            {activeTab === "issues" && (
                <IssueTable issues={teamIssues} showProject showTeam />
            )}

            {/* Teams */}
            {activeTab === "projects" && (
                <div>
                    <div ref={teamBoxRef} className="flex justify-between mb-2 relative">
                        <div className="flex items-center gap-6 text-sm text-neutral-500">

                            <span>{teamDetails?.team?.projects?.length} projects</span>
                        </div>
                        <button
                            onClick={() => setShowProjectBox((prev) => !prev)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                            )}
                        >
                            <span className="hidden sm:inline">Assign/Remove</span>
                        </button>

                        <DropdownSelectModal
                            open={showProjectBox}
                            onClose={() => setShowProjectBox(false)}
                            search={searchTeam}
                            onSearchChange={setSearchTeam}
                            placeholder="Search projects..."
                            items={projects || []}
                            selectedIds={selectedProject}
                            getId={(project) => Number(project?.id)}
                            getLabel={(project) => project?.name || ""}
                            getSecondaryLabel={(project) => project?.status || ""}
                            onSelect={handleToggleProject}
                            emptyMessage="No projects available"
                        />
                    </div>

                    <div>
                        {teamDetails?.team?.projects.map((member) => {
                            return (
                                <div
                                    key={member?.projectId}
                                    className="border-b border-neutral-200/40 dark:border-neutral-800/40 p-2"
                                    onClick={() => navigate(`/projects/${member?.projectId}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border-r border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                                            <Folder className="w-4 h-4 text-neutral-500" />
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                {member?.project?.name}
                                            </h3>

                                            <span className="text-sm text-neutral-500">
                                                {member?.project?.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}


            {activeTab === "members" && (
                <div>
                    <div ref={teamBoxRef} className="flex justify-between mb-2 relative">
                        <div className="flex items-center gap-6 text-sm text-neutral-500">
                            {/* <span>5 teams assigned</span> */}
                            <span>18 availableMembers</span>
                            {/* <span>42 open issues</span> */}
                        </div>
                        <button
                            onClick={() => setShowTeamBox((prev) => !prev)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Add member</span>
                        </button>

                        <DropdownSelectModal
                            open={showTeamBox}
                            onClose={() => setShowTeamBox(false)}
                            search={searchTeam}
                            onSearchChange={setSearchTeam}
                            placeholder="Search members..."
                            items={allMembers || []}
                            selectedIds={selectedMembers}
                            getId={(user) => Number(user?.id)}
                            getLabel={(user) => user?.name || ""}
                            getSecondaryLabel={(user) => user?.role || ""}
                            onSelect={handleToggleMember}
                            emptyMessage="No members available"
                            footer={
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTeamBox(false);
                                        setShowInviteMemberModal(true);
                                    }}
                                    className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800"
                                >
                                    + Invite Member
                                </button>
                            }
                        />


                    </div>

                    <div>
                        {teamDetails?.teamMembers.map((member) => {
                            return (
                                <div
                                    key={member?.userId}
                                    className="border-b border-neutral-200/40 dark:border-neutral-800/40 p-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 border-r border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-neutral-500" />
                                        </div>

                                        <div className="flex justify-between w-full">
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                {member?.member?.name}
                                            </h3>

                                            <span className="text-sm text-neutral-500">
                                                {member?.member?.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
                <div className="max-w-xl space-y-3">
                    {[
                        {
                            icon: Settings,
                            label: "Permissions",
                            description:
                                "Manage who can access this project",
                        },
                        {
                            icon: CheckSquare,
                            label: "Workflows",
                            description:
                                "Customize issue statuses and transitions",
                        },
                        {
                            icon: Users,
                            label: "Labels",
                            description:
                                "Organize issues with custom labels",
                        },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className="w-full flex items-center gap-4 p-2 text-left"
                        >
                            <div className="w-10 h-10 rounded-md border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                                <item.icon className="w-4 h-4 text-neutral-500" />
                            </div>

                            <div className="flex-1">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {item.label}
                                </div>

                                <div className="text-xs text-neutral-500">
                                    {item.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}


            <InviteMemberModal
                open={showInviteMemberModal}
                onClose={() => setShowInviteMemberModal(false)}
                onInvite={refetchMembers}
            />
        </div>
    );
}