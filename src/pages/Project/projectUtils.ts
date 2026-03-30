export interface User {
    id: number;
    name: string;
    email: string;
    description: string | null;
    password: string;
    role: "USER" | "ADMIN"; // extend if needed
    createdAt: string;
    updatedAt: string;
    createdById: number | null;
    updatedById: number | null;
}

export interface Project {
    id: number;
    organizationId: number;
    name: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    createdAt: string | Date | undefined;
    updatedAt: string;
    createdById: number;
    updatedById: number;
    status: "PLANNING" | "IN_PROGRESS" | "COMPLETED"; // extend if needed
    createdBy: User;
}