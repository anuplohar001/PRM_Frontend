// utils/storage.ts

export interface Organization {
    id: number;
    name: string;
    [key: string]: any;
}

export const getOrganization = (): Organization | null => {
    try {
        const organization = localStorage.getItem("lastOrganizationId")

        if (!organization) return null;
        return JSON.parse(organization);
    } catch (error) {
        console.error("Failed to parse organization:", error);
        return null;
    }
};