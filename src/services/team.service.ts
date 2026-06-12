import { useEffect, useState } from "react"
import { useApi } from "./hooks/useApi"
import { useParams } from "react-router-dom"
import { Project, User, ProjectTeam, Team } from "./hooks/types"


type TeamResponse = {
    teams: Team[]
    team: Team
}

export interface TeamProjects {
    id: number;
    projectId: number;
    teamId: number;
    assignedById: number;
    assignedAt: string;
    project: Project;
}
export interface TeamMember {
    id: number;
    teamId: number;
    userId: number;
    role: string;
    addedById: number | null;
    member: User;
}

export interface TeamProject {
    id: number;
    projectId: number;
    teamId: number;
    assignedById: number;
    assignedAt: string;
    project: Project;
}

export interface TeamDetails extends Team {
    createdBy?: User | null;
    updatedBy?: User | null;
    projects: TeamProject[];
}

export interface ViewTeamResponse {
    team: TeamDetails;
    fullTeamAccess: boolean;
    teamMembers: TeamMember[];
}


type AvailableMember = {
    id: number
    organizationId: number
    userId: number
    role: string
    createdAt?: string
    updatedAt?: string

    user: User
}

type GetAddMembersListResponse = {
    members: AvailableMember[]
}

interface CreateTeamPayload {
    name: string
    organizationId: number
    createdById: number
}

interface CreateTeamResponse {
    success: boolean
    message: string
    data: {
        team: {
            id: number
            name: string
            organizationId: number
            createdAt: string
            updatedAt: string
        }
    }
}



export interface AddTeamMemberPayload {
    teamId: number;
    memberId: number;
}
interface AssignTeamPayload {
    teamId: number;
    projectId: number;
}
export interface AddTeamMemberResponse {
    success: boolean;
    message: string;
    teamMember: {
        id: number;
        teamId: number;
        memberId: number;
    };
}

export interface AssignTeamResponse {
    success: boolean;
    message: string;
    projectTeam: ProjectTeam
}

export const useCreateTeam = () => {
    const [team, setTeam] = useState<CreateTeamResponse["data"]["team"]>()

    const { callApi, loading } = useApi()

    const createTeam = (
        payload: CreateTeamPayload,
        onSuccess?: (data: CreateTeamResponse) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<CreateTeamResponse>(
            {
                endpoint: "/teams/create",
                method: "POST",
                body: payload,
            },
            (data) => {
                setTeam(data?.data?.team)

                onSuccess?.(data)
            },
            (err) => {
                console.error(err.message)

                onError?.(err)
            }
        )
    }

    return {
        createTeam,
        team,
        loading,
    }
}


export const useTeamDetails = () => {
    const [teamDetails, setTeamDetails] = useState<ViewTeamResponse>()
    const { id } = useParams()
    const { callApi: fetchTeams, loading } = useApi()

    const getTeamDetails = () => {
        fetchTeams<ViewTeamResponse>(
            {
                endpoint: `/teams/view-team/${id}`,
                method: "GET",
            },
            (data) => {
                setTeamDetails(data)
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        getTeamDetails()
    }, [])

    return {
        teamDetails,
        loading,
        refetchTeamDetails: getTeamDetails
    }
}



export const useAvailableMembersList = () => {
    const [members, setMembers] = useState<AvailableMember[]>([])
    const organization = localStorage.getItem("lastOrganizationId")
    const { id: teamId } = useParams()

    const { callApi: fetchMembers, loading } = useApi()

    const getAvailableMembers = () => {
        fetchMembers<GetAddMembersListResponse>(
            {
                endpoint: `/teams/get-add-team-member-list/${organization}/${teamId}`,
                method: "GET",
            },
            (data) => {
                setMembers(data?.members || [])
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        if (organization && teamId) {
            getAvailableMembers()
        }
    }, [])

    return {
        members,
        loading,
        refetchMembers: getAvailableMembers
    }
}




const useTeams = () => {
    const [teams, setTeams] = useState<Team[]>([])

    const { callApi: fetchTeams, loading: teamsLoading } = useApi()

    const getUserTeams = () => {
        fetchTeams<TeamResponse>(
            {
                endpoint: "/teams/",
                method: "GET",
            },
            (data) => {
                setTeams(data.teams || [])
            },
            (err) => {
                console.error(err.message)
            }
        )
    }

    useEffect(() => {
        getUserTeams()
    }, [])

    return {
        teams,
        teamsLoading,
        refetchTeams: getUserTeams
    }
}

export default useTeams







export const useAddTeamMember = () => {
    const [teamMember, setTeamMember] =
        useState<
            AddTeamMemberResponse["teamMember"]
        >();

    const { callApi, loading } = useApi();

    const addTeamMember = (
        payload: AddTeamMemberPayload,
        onSuccess?: (
            data: AddTeamMemberResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<AddTeamMemberResponse>(
            {
                endpoint: "/teams/add-member",
                method: "POST",
                body: payload,
            },
            (data) => {
                setTeamMember(
                    data?.teamMember
                );

                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);

                onError?.(err);
            }
        );
    };

    return {
        addTeamMember,
        teamMember,
        loading,
    };
};



export const useAssignTeam = () => {
    const [teamMember, setTeamMember] = useState<AssignTeamResponse["projectTeam"]>();

    const { callApi, loading: assigningTeam } = useApi();

    const assignTeamToProject = (
        payload: AssignTeamPayload,
        onSuccess?: (
            data: AssignTeamResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<AssignTeamResponse>(
            {
                endpoint: "/teams/assign-team",
                method: "POST",
                body: payload,
            },
            (data) => {
                setTeamMember(
                    data?.projectTeam
                );

                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);

                onError?.(err);
            }
        );
    };

    return {
        assignTeamToProject,
        teamMember,
        assigningTeam,
    };
};



export interface UpdateTeamPayload {
    teamId: number;
    name: string;
}

export const useUpdateTeamName = () => {
    const { callApi, loading } = useApi();

    const updateTeamName = (
        payload: UpdateTeamPayload,
        onSuccess?: () => void,
        onError?: (error: Error) => void
    ) => {
        callApi(
            {
                endpoint: `/teams/${payload.teamId}`,
                method: "PUT",
                body: {
                    name: payload.name,
                },
            },
            () => {
                onSuccess?.();
            },
            (err) => {
                onError?.(err);
            }
        );
    };

    return {
        updateTeamName,
        loading,
    };
};