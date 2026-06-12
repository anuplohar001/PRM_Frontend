export type Option = {
    label: string;
    value: string | number | undefined;
};

export type TaskType =
    | "BUG"
    | "FEATURE"
    | "TASK"
    | "IMPROVEMENT"
    | "STORY"
    | "SUBTASK"
    | "EPIC";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type ProjectStatus =
    | "PLANNING"
    | "IN_PROGRESS"
    | "ON_HOLD"
    | "COMPLETED"
    | "CANCELLED"

export type ProjectRoles =
    | "PROJECT_ADMIN"
    | "PROJECT_MANAGER"
    | "PROJECT_MEMBER"

export type TeamRoles =
    | "TEAM_LEAD"
    | "TEAM_MEMBER"






export interface ProjectTeam {
    id?: number;
    projectId: number;
    teamId: number;
    assignedById: number;
    assignedAt: string;
    team: Team
}





export interface Project {
    id: number
    organizationId: number
    name: string
    description?: string | null
    startDate?: string | null
    endDate?: string | null
    createdAt?: string
    updatedAt?: string
    createdById?: number | null
    updatedById?: number | null
    status: ProjectStatus

    workflow?: WorkFlow[]
    members?: ProjectMember[]
    createdBy?: User | null
    organization?: Organization
    updatedBy?: User | null

    tasks?: Task[]
    activities?: Activity[]

    teams: ProjectTeam[]
}

export interface ProjectMember {
    id: number
    projectId: number
    organizationId?: number | null
    userId: number
    joinedAt: string
    addedById?: number | null
    role: ProjectRoles

    addedBy?: User | null
    project?: Project
    organization?: Organization | null
    user: User
}

export interface Team {
    id: number
    name: string
    organizationId: number

    members?: TeamMember[]

    createdById: number
    updatedById: number

    createdBy?: User
    updatedBy?: User

    createdAt: string
    updatedAt: string
}

export interface TeamMember {
    id: number

    teamId: number
    userId: number
    role: TeamRoles
    addedById?: number | null

    addedBy?: User | null
    member?: User
    team?: Team
}

/* Placeholder related types */


export interface Organization {
    id: number
    name?: string
}

export interface WorkFlow {
    id: number
    name?: string
}


export interface Activity {
    id: number
    action?: string
}


export type Workflow = {
    id: number
    name: string
    description: string
    position: number | null
}

export interface UserTeam {
    id: number;
    name: string;
}

export interface UserProject {
    id: number;
    name: string;
}

export interface TeamMembership {
    team: UserTeam;
}

export interface ProjectMembership {
    project: UserProject;
}
export interface OrganizationMembership {
    organization: Organization;
}

export interface User {
    id: number;
    name: string;
    email?: string;
    description?: string | null;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
    createdById?: number | null;
    updatedById?: number | null;
    lastOrganizationId?: number | null;
    lastOrganization: {
        id: number,
        name: string,
    },
    teamMemberships?: TeamMembership[];
    projectMemberships?: ProjectMembership[];
    organizationMemberships?: OrganizationMembership[];
}


export type Member = {
    id: number;
    role: "ORG_OWNER" | "ORG_MEMBER" | "ORG_ADMIN";
    organizationId: number,
    userId: number,
    user:User;
    addedBy: User
    // add other fields if needed
};

export type Task = {
    id?: number | null;

    title: string;
    description?: string | null;

    type: TaskType;
    priority?: Priority | null;

    projectId: number | null;
    statusId?: number | null;

    assignedBy?: number | null;
    assignedTo?: number | null;

    createdAt?: string; 
    project?: Project;
    status?: Workflow;
    assignedByUser?: User;
    assignedToUser?: User;
};