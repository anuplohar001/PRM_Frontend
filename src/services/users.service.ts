import { useState } from "react";
import { useApiOnLoad } from "./hooks/useApiOnLoad";
import { useApi } from "./hooks/useApi";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface GetUsersResponse {
    users: User[];
}

export const useUsers = (enabled = true) => {
    const [users, setUsers] = useState<User[]>([]);
    const organization = localStorage.getItem("lastOrganizationId")
    const { loading, error, callApi } = useApiOnLoad<GetUsersResponse>({
        config: enabled
            ? {
                endpoint: `/users/${organization}`,
                method: "GET",
            }
            : null,
        enabled,
        onSuccess: (data) => {
            setUsers(data?.users || []);
        },
    });

    const refetchUsers = () => {
        callApi(
            {
                endpoint: `/users/${organization?.id}`,
                method: "GET",
            },
            (data) => {
                setUsers(data?.users || []);
            }
        );
    };

    return {
        users,
        loading,
        error,
        refetchUsers,
    };
};



interface UpdateLastOrganizationPayload {
    organizationId: number;
    userId: number;
}

interface UpdateLastOrganizationResponse {
    user: User;
}

export const useUpdateLastOrganization = () => {
    const [user, setUser] = useState<User>();

    const { callApi, loading } = useApi();

    const updateLastOrganization = (
        payload: UpdateLastOrganizationPayload,
        onSuccess?: (
            data: UpdateLastOrganizationResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<UpdateLastOrganizationResponse>(
            {
                endpoint: "/users/last-organization",
                method: "PATCH",
                body: payload,
            },
            (data) => {
                setUser(data?.user);

                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);

                onError?.(err);
            }
        );
    };

    return {
        updateLastOrganization,
        user,
        loading,
    };
};