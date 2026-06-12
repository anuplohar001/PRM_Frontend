import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FolderKanban,
    CheckSquare,
    Users,
    Activity,
    Settings,
    Plus,
    User,
    Edit2,
} from "lucide-react";

import { cn } from "../../lib/utils";
import {
    getIssuesByProject,
} from "../../data/mockData";
import IssueTable from "../../components/ui/IssueTable";
import { useAvailableMembers, useAvailableTeams, useManageProjectMember, useManageProjectTeam, useUpdateProject, useViewProject } from "@/services/project.service";
import DropdownSelectModal from "@/components/DropdownModal";
import { Project, ProjectTeam, User as UserType } from "@/services/hooks/types";
import UserHoverCard from "@/components/UserHoverCard";
import UserSelectModal from "@/components/UserSelectModal";
import { getUser } from "@/utils/getLocalUser";
import InviteMemberModal from "../Teams/InviteMemberModal";

const tabs = [
    { key: "issues", label: "Issues", icon: CheckSquare },
    { key: "teams", label: "Teams Assigned", icon: Users },
    { key: "members", label: "Members", icon: User },
    { key: "settings", label: "Settings", icon: Settings },
];
type ProjectMemberType = UserType & {
    projectRole?: string;
};
export default function ProjectDetail() {

    const user = getUser()
    const { id } = useParams();
    const navigate = useNavigate()
    const { project: projectDetails, loading, refetchProject } = useViewProject()
    const {
        teams: availableTeams,
        loading: teamsLoading,
        refetchTeams,
    } = useAvailableTeams(Number(id));


    const {
        members,
        membersLoading,
        refetchMembers,
    } = useAvailableMembers(Number(id));

    const { manageProjectTeam } = useManageProjectTeam()


    const {
        manageProjectMember,
        managingProjectMember,
    } = useManageProjectMember();

    const { updateProject } = useUpdateProject();


    const [project, setProject] = useState<Project>()
    const [projectMembers, setProjectMembers] = useState<ProjectMemberType[] | undefined>()
    const [projectTeams, setProjectTeams] = useState<ProjectTeam[]>([]);
    const [originalName, setOriginalName] = useState("");
    const [activeTab, setActiveTab] = useState("issues");
    const projectIssues = getIssuesByProject(1);
    const [showTeamBox, setShowTeamBox] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([])
    const [showMembersBox, setShowMembersBox] = useState(false);
    const [searchTeam, setSearchTeam] = useState("");
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const teamBoxRef = useRef(null);
    const [hoveredUser, setHoveredUser] = useState<UserType | null>(null);
    const [showInviteMemberModal, setShowInviteMemberModal] = useState(false)
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    useEffect(() => {
        if (projectDetails) {
            const members: ProjectMemberType[] =
                projectDetails?.members?.map((member) => ({
                    ...member.user,
                    projectRole: member.role,
                })) || [];

            setProject(projectDetails);
            setOriginalName(projectDetails.name);
            setProjectMembers(members)
            setProjectTeams(projectDetails.teams || []);
        }
    }, [projectDetails]);

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

    const filteredTeams = availableTeams.filter((team) =>
        team.name.toLowerCase().includes(searchTeam.toLowerCase())
    );



    useEffect(() => {
        if (project?.members && project?.members?.length > 0) {
            setSelectedMembers(project?.members?.map((member) => Number(member?.user?.id)))
        }
        if (project?.teams?.length) {
            setSelectedTeamIds(
                project.teams.map((team) => team.teamId)
            );
        }
    }, [project])



    const handleToggleMember = (member: UserType) => {
        const isSelected = selectedMembers.includes(member.id);

        if (isSelected) {
            setSelectedMembers((prev) =>
                prev.filter((id) => id !== member.id)
            );

            setProjectMembers((prev) =>
                prev?.filter((m) => m.id !== member.id)
            );

            manageProjectMember(
                {
                    memberId: member.id,
                    projectId: Number(id),
                    action: "remove",
                },
                () => { },
                () => {
                    setSelectedMembers((prev) => [...prev, member.id]);
                    setProjectMembers((prev) => [...prev, member]);
                }
            );

            return;
        }

        setSelectedMembers((prev) => [...prev, member.id]);

        setProjectMembers((prev) => [...prev, { ...member, projectRole: "PROJECT_MEMBER" }]);

        manageProjectMember(
            {
                memberId: member.id,
                projectId: Number(id),
                action: "add",
            },
            () => { },
            () => {
                setSelectedMembers((prev) =>
                    prev.filter((id) => id !== member.id)
                );

                setProjectMembers((prev) =>
                    prev?.filter((m) => m.id !== member.id)
                );
            }
        );
    };

    const handleSelectTeam = (teamId: number) => {
        const isSelected = selectedTeamIds.includes(teamId);

        if (isSelected) {
            const teamToRemove = projectTeams.find(
                (t) => t.teamId === teamId
            );

            setSelectedTeamIds((prev) =>
                prev.filter((id) => id !== teamId)
            );

            setProjectTeams((prev) =>
                prev.filter((t) => t.teamId !== teamId)
            );

            manageProjectTeam(
                {
                    projectId: Number(id),
                    teamId,
                    action: "detach",
                },
                () => { },
                () => {
                    setSelectedTeamIds((prev) => [
                        ...prev,
                        teamId,
                    ]);

                    if (teamToRemove) {
                        setProjectTeams((prev) => [
                            ...prev,
                            teamToRemove,
                        ]);
                    }
                }
            );

            return;
        }
        const team = availableTeams.find(
            (t) => t.id === teamId
        );
        setSelectedTeamIds((prev) => [...prev, teamId]);

        if (team) {
            setProjectTeams((prev) => [
                ...prev,
                {
                    assignedById: Number(user?.id),
                    assignedAt: Date.now().toLocaleString(),
                    projectId: Number(id),
                    teamId: team.id,
                    team,
                },
            ]);
        }

        manageProjectTeam(
            {
                projectId: Number(id),
                teamId,
                action: "assign",
            },
            () => { },
            () => {
                setSelectedTeamIds((prev) =>
                    prev.filter((id) => id !== teamId)
                );

                setProjectTeams((prev) =>
                    prev.filter((t) => t.teamId !== teamId)
                );
            }
        );
    };



    const handleProjectNameBlur = () => {
        if (!project || project.name === originalName) {
            return;
        }

        updateProject(
            {
                projectId: project.id,
                name: project.name,
            },
            () => {
                setOriginalName(project.name);
            },
            () => {
                setProject((prev) =>
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
                            <FolderKanban className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Enter project title..."
                                value={project?.name || ""}
                                onChange={(e) =>
                                    setProject((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                name: e.target.value,
                                            }
                                            : prev
                                    )
                                }
                                className="project-title-input"
                                onBlur={handleProjectNameBlur}
                            />

                            <p className="text-sm text-neutral-500 mt-1">
                                {project?.description}
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



            {/* Issues */}
            {activeTab === "issues" && (
                <IssueTable issues={projectIssues} showProject showTeam />
            )}

            {/* Teams */}
            {activeTab === "teams" && (
                <div>
                    <div ref={teamBoxRef} className="flex justify-between mb-2 relative">
                        <div className="flex items-center gap-6 text-sm text-neutral-500">
                            <span>5 teams assigned</span>
                            <span>18 members</span>
                            <span>42 open issues</span>
                        </div>
                        <button
                            onClick={() => setShowTeamBox((prev) => !prev)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                            )}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Add Team</span>
                        </button>
                        <DropdownSelectModal
                            open={showTeamBox}
                            onClose={() => setShowTeamBox(false)}
                            search={searchTeam}
                            onSearchChange={setSearchTeam}
                            placeholder="Search teams..."
                            items={filteredTeams}
                            selectedIds={selectedTeamIds}
                            getId={(team) => team.id}
                            getLabel={(team) => team.name}
                            getSecondaryLabel={(team) =>
                                `members`
                            }
                            onSelect={handleSelectTeam}
                            emptyMessage="No teams found create new..."
                        />

                    </div>

                    <div>
                        {projectTeams?.map((team) => (
                            <div
                                key={team.teamId}
                                className="border-b border-neutral-200/40 dark:border-neutral-800/40 p-2 cursor-pointer"
                                title={`Click to view ${team.team.name}`}
                                onClick={() => navigate(`/teams/${team.teamId}`)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border-r border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-neutral-500" />
                                    </div>

                                    <div className="flex justify-between w-full">
                                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                            {team.team.name}
                                        </h3>

                                        <span className="text-sm text-neutral-500">
                                            5
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Teams */}
            {activeTab === "members" && (
                <div>
                    <div ref={teamBoxRef} className="flex justify-between mb-2 relative">
                        <div className="flex items-center gap-6 text-sm text-neutral-500">

                            <span>{project?.members?.length} members</span>
                        </div>
                        <button
                            onClick={() => setShowMembersBox((prev) => !prev)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                            )}
                        >
                            {/* <Plus className="w-3.5 h-3.5" /> */}
                            <span className="hidden sm:inline">Add/Remove</span>
                        </button>

                        <UserSelectModal
                            open={showMembersBox}
                            onClose={() => setShowMembersBox(false)}
                            search={searchTeam}
                            placeholder="Search members from teams..."
                            onSearchChange={setSearchTeam}
                            users={members}
                            selectedIds={selectedMembers}
                            onSelect={handleToggleMember}
                            emptyMessage="No members found"
                            footer={
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMembersBox(false);
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
                        {projectMembers?.map((member) => (
                            <div
                                key={member.id}
                                className="border-b border-neutral-200/40 dark:border-neutral-800/40 p-2 cursor-pointer"

                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 border-r border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center">
                                        <User className="w-4 h-4 text-neutral-500" />
                                    </div>

                                    <div className="group relative flex justify-between w-full">
                                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white"
                                            onMouseEnter={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();

                                                setPosition({
                                                    x: rect.left + 50,
                                                    y: rect.top - 170,
                                                });

                                                setHoveredUser(member || null);
                                            }}

                                            onMouseLeave={() => {
                                                setHoveredUser(null);
                                            }}
                                        >
                                            {member.name}
                                        </h3>

                                        <span className="text-sm text-neutral-500">
                                            {member?.projectRole}
                                        </span>


                                    </div>
                                </div>
                            </div>
                        ))}
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
                        {
                            icon: Activity,
                            label: "Integrations",
                            description:
                                "Connect third-party tools",
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

            {hoveredUser && (
                <UserHoverCard
                    name={hoveredUser?.name || ""}
                    email={hoveredUser?.email}
                    role={hoveredUser?.role}
                    teams={
                        hoveredUser?.teamMemberships?.map(
                            (membership) => membership.team
                        ) || []
                    }
                    projects={
                        hoveredUser?.projectMemberships?.map(
                            (membership) => membership.project
                        ) || []
                    }
                    position={position}
                />
            )}

            <InviteMemberModal
                open={showInviteMemberModal}
                onClose={() => setShowInviteMemberModal(false)}
            />
        </div>
    );
}