import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi"; // your existing hook
import { apiRequest } from "../services/api.services";
type Permission = {
    id: number;
    resourceId: number;
    resource: string;
    target: string;
    targetId: number;
    effect: "ALLOW" | "DENY";
    permissions: string[];
};

type Actions = string []

type PermissionsResponse = {
    permissions: Permission;
    actions: Actions
};
const usePermissions = (resourceId: number, resource: string = "ORGANIZATION") => {
    const { callApi, loading } = useApi();

    const [permissions, setPermissions] = useState<Actions>([]);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const endpoint =
        resource === "ORGANIZATION"
            ? `/organizations/permissions/${resourceId}`
            : resource === "PROJECT"
                ? `/projects/permissions/${resourceId}`
                : resource === "TEAM"
                    ? `/teams/permissions/${resourceId}`
                    : "";

    const fetchPermissions = useCallback(() => {
        if (!resourceId) return;

        callApi<PermissionsResponse>(
            apiRequest({
                endpoint,
                method: "GET",
            }),
            (data) => {
                try {
                    setPermissions(data.actions);
                    setHasAccess(true);
                    setError(null);
                } catch (err) {
                    setError(err);
                }
            },
            (err) => {
                console.error(err.message);
                setError(err);
                setHasAccess(false);
            }
        );
    }, [resourceId, callApi, endpoint]);

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        permissions,
        loading,
        error,
        hasAccess,
        refetch: fetchPermissions,
    };
};

export default usePermissions;