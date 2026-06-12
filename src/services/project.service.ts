// hooks/useProjects.ts

import { useEffect, useState } from "react";
import { useApi } from "./hooks/useApi";
import { useParams } from "react-router-dom";
import { Project, ProjectTeam, Team, User } from "./hooks/types";
import { useApiOnLoad } from "./hooks/useApiOnLoad";
import { getOrganization } from "@/utils/getLocalOrganization";


interface ProjectResponse {
    projects: Project[];
}

type viewProjectResponse = {
    project: Project
}

interface CreateProjectPayload {
    name: string
    description?: string
    organizationId: number
    teamIds: number[]
}

interface CreateProjectResponse {
    project: Project
}

export interface GetAvailableTeamsResponse {
    teams: Team[];
}


interface GetAvailableMembersResponse {
    members: User[];
}







export const useCreateProject = () => {
    const [project, setProject] = useState<Project>()

    const { callApi, loading } = useApi()

    const createProject = (
        payload: CreateProjectPayload,
        onSuccess?: (data: CreateProjectResponse) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<CreateProjectResponse>(
            {
                endpoint: "/projects/create",
                method: "POST",
                body: payload,
            },
            (data) => {
                setProject(data?.project)

                onSuccess?.(data)
            },
            (err) => {
                console.error(err.message)

                onError?.(err)
            }
        )
    }

    return {
        createProject,
        project,
        loading,
    }
}

export default function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);

    const orgId = localStorage.getItem("lastOrganizationId")

    // const {
    //     permissions,
    //     loading: permissionsLoading,
    // } = usePermissions(org?.id, "ORGANIZATION");

    const {
        callApi: fetchAllProjects,
        loading: fetchingAllProjects,
    } = useApi();


    const getAllProjects = () => {
        fetchAllProjects<ProjectResponse>(
            {
                endpoint: `/projects/${orgId}`,
                method: "GET",
            },
            (data) => {
                setProjects(data.projects);
            },
            (err) => {
                console.error(err.message);
            }
        );
    };

    useEffect(() => {
        getAllProjects();
    }, []);

    return {
        projects,
        fetchingAllProjects,

        refetchProjects: getAllProjects,
    };
}

export const useViewProject = () => {

    const [project, setProject] = useState<Project>();

    const { id } = useParams()

    // const {
    //     permissions,
    //     loading: permissionsLoading,
    // } = usePermissions(org?.id, "ORGANIZATION");

    const {
        callApi: fetchProject,
        loading: fetchingProject,
    } = useApi();


    const getProject = () => {
        fetchProject<viewProjectResponse>(
            {
                endpoint: `/projects/view-project/${id}`,
                method: "GET",
            },
            (data) => {
                
                setProject(data.project);
            },
            (err) => {
                console.error(err.message);
            }
        );
    };

    useEffect(() => {
        getProject();
    }, []);

    return {
        project,
        loading:
            fetchingProject,

        refetchProject: getProject,
    };
}




export const useAvailableTeams = (
    projectId?: number
) => {
    const [teams, setTeams] = useState<Team[]>([]);

    const { loading, error, callApi } =
        useApiOnLoad<GetAvailableTeamsResponse>({
            config: projectId
                ? {
                    endpoint: `/projects/available-teams/${projectId}`,
                    method: "GET",
                }
                : null,
            dependencies: [projectId],
            onSuccess: (data) => {
                setTeams(data?.teams || []);
            },
        });

    const refetchTeams = () => {
        if (!projectId) return;

        callApi(
            {
                endpoint: `/projects/available-teams/${projectId}`,
                method: "GET",
            },
            (data) => {
                setTeams(data?.teams || []);
            }
        );
    };

    return {
        teams,
        loading,
        error,
        refetchTeams,
    };
};



export interface ManageProjectTeamPayload {
    projectId: number;
    teamId: number;
    action: "assign" | "detach";
}

export interface ManageProjectTeamResponse {
    success: boolean;
    message: string;
    data?: {
        id: number;
        projectId: number;
        teamId: number;
        assignedById: number;
        assignedAt: string;
    };
}
export const useManageProjectTeam = () => {
    const { callApi, loading } = useApi();

    const manageProjectTeam = (
        payload: ManageProjectTeamPayload,
        onSuccess?: (
            data: ManageProjectTeamResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<ManageProjectTeamResponse>(
            {
                endpoint: "/projects/manage-team",
                method: "POST",
                body: payload,
            },
            (data) => {
                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);
                onError?.(err);
            }
        );
    };

    return {
        manageProjectTeam,
        loading,
    };
};




export const useAvailableMembers = (
    projectId?: number
) => {
    const [members, setMembes] = useState<User[]>([]);
    const endpoint = `/projects/available-members/${projectId}`
    const { loading: membersLoading, error, callApi } =
        useApiOnLoad<GetAvailableMembersResponse>({
            config: projectId
                ? {
                    endpoint,
                    method: "GET",
                }
                : null,
            dependencies: [projectId],
            onSuccess: (data) => {
                setMembes(data?.members || []);
            },
        });

    const refetchMembers = () => {
        if (!projectId) return;

        callApi(
            {
                endpoint,
                method: "GET",
            },
            (data) => {
                setMembes(data?.members || []);
            }
        );
    };

    return {
        members,
        membersLoading,
        error,
        refetchMembers,
    };
};



export interface ManageProjectMemberPayload {
    memberId: number;
    projectId: number;
    action: "add" | "remove";
}

export interface ManageProjectMemberResponse {
    success: boolean;
    message: string;
}

export const useManageProjectMember = () => {
    const { callApi, loading: managingProjectMember } = useApi();

    const manageProjectMember = (
        payload: ManageProjectMemberPayload,
        onSuccess?: (data: ManageProjectMemberResponse) => void,
        onError?: (error: Error) => void
    ) => {
        const organization = localStorage.getItem("lastOrganizationId")

        callApi<ManageProjectMemberResponse>(
            {
                endpoint: "/projects/manage-member",
                method: "POST",
                body: {
                    memberId: payload.memberId,
                    projectId: payload.projectId,
                    organizationId: organization,
                    action: payload.action,
                },
            },
            (data) => {
                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);
                onError?.(err);
            }
        );
    };

    return {
        manageProjectMember,
        managingProjectMember,
    };
};






export interface UpdateProjectPayload {
    projectId: number;
    name: string;
}

export interface UpdateProjectResponse {
    success: boolean;
    message: string;
    project: Project;
}

export const useUpdateProject = () => {
    const [project, setProject] =
        useState<UpdateProjectResponse["project"]>();

    const { callApi, loading: updatingProject } = useApi();

    const updateProject = (
        payload: UpdateProjectPayload,
        onSuccess?: (
            data: UpdateProjectResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<UpdateProjectResponse>(
            {
                endpoint: `/projects/${payload.projectId}`,
                method: "PUT",
                body: {
                    id: payload.projectId,
                    name: payload.name,
                    organizationId: localStorage.getItem("lastOrganizationId")
                },
            },
            (data) => {
                setProject(data?.project);

                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);

                onError?.(err);
            }
        );
    };

    return {
        updateProject,
        project,
        updatingProject,
    };
};