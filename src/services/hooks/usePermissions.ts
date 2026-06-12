import { useEffect, useState, useCallback, useMemo } from "react";
import { useApi } from "./useApi";
import { useAlert } from "../../components/CustomAlert/AlertContext";

type Permission = {
    id: number;
    resourceId: number;
    resource: string;
    target: string;
    targetId: number;
    effect: "ALLOW" | "DENY";
    permissions: string[];
};

type Actions = string[];

type PermissionsResponse = {
    success: boolean;
    permissions: Permission;
    actions: Actions;
    message: string;
};

const usePermissions = (
    resourceId: number | null,
    resource: string = "ORGANIZATION"
) => {
    const { callApi, loading } = useApi();

    const [permissions, setPermissions] = useState<Actions>([]);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);

    const { showAlert } = useAlert();

    const endpoint = useMemo(() => {
        if (!resourceId) return null;

        switch (resource) {
            case "ORGANIZATION":
                return `/organizations/permissions/${resourceId}`;

            case "PROJECT":
                return `/projects/permissions/${resourceId}`;

            case "TEAM":
                return `/teams/permissions/${resourceId}`;

            default:
                return null;
        }
    }, [resourceId, resource]);

    const fetchPermissions = useCallback(() => {
        if (!endpoint) return;

        callApi<PermissionsResponse>(
            {
                endpoint,
                method: "GET",
            },
            (data) => {
                setPermissions(data.actions);
                setHasAccess(true);
                setError(null);
            },
            (err) => {
                console.log(err.message);

                showAlert({
                    type: "error",
                    message: err.message,
                    showCancel: true,
                });

                setError(err);
                setHasAccess(false);
            }
        );
    }, [resourceId, callApi, endpoint, showAlert]);

    useEffect(() => {
        if (!endpoint) return;

        fetchPermissions();
    }, [resourceId, resource]);

    return {
        permissions,
        loading,
        error,
        hasAccess,
        refetch: fetchPermissions,
    };
};

export default usePermissions;