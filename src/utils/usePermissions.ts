import { useEffect, useState, useCallback } from "react";
import { useApi } from "./useApi"; // your existing hook
import getActionsFromGroups from "./getAllPermissions"; // adjust path
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

type PermissionsResponse = {
    permissions: Permission;
};
const usePermissions = (organizationId: number) => {
    const { callApi, loading } = useApi();

    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    const fetchPermissions = useCallback(() => {
        if (!organizationId) return;

        callApi<PermissionsResponse>(
            apiRequest({
                endpoint: `/organizations/permissions/${organizationId}`,
                method: "GET",
            }),
            (data) => {
                try {
                    const actions = getActionsFromGroups(
                        data?.permissions?.permissions
                    );
                    setPermissions(actions);
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
    }, [organizationId, callApi]);

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