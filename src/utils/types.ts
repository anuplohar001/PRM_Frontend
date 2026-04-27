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

export type Project = {
    id: string;
    name: string;
};



export type Workflow = {
    id: number
    name: string
    description: string
    position: number | null
}

export type User = {
    id: string;
    name: string;
    email?: string;
};


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

    createdAt?: string; // ISO string from backend

    // 🔥 optional populated relations (when using include)
    project?: Project;
    status?: Workflow;
    assignedByUser?: User;
    assignedToUser?: User;
};