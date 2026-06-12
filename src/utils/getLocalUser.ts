// utils/storage.ts

import { User } from "@/services/hooks/types";


export const getUser = (): User | null => {
    try {
        const user = localStorage.getItem("user");

        if (!user) return null;
        return JSON.parse(user);
    } catch (error) {
        console.error("Failed to parse user:", error);
        return null;
    }
};