import { useEffect, useState, useMemo, useCallback } from "react";
import { apiRequest, ApiRequestOptions } from "./useApi";
import { useAlert } from "../../components/CustomAlert/AlertContext";

type ApiResponse<T> = {
    success: boolean;
    data: T;
    message: string;
};

type UseApiOnLoadProps<T> = {
    config: ApiRequestOptions | null;
    dependencies?: any[];
    onSuccess?: (data: T) => void;
    onError?: (err: any) => void;
    enabled?: boolean;
};




export const useApiOnLoad = <T>({
    config,
    dependencies = [],
    onSuccess,
    onError,
    enabled = true,
}: UseApiOnLoadProps<T>) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { showAlert } = useAlert();

    const memoizedConfig = useMemo(
        () => config,
        [JSON.stringify(config)]
    );

    const callApi = useCallback(
        async (
            config: ApiRequestOptions,
            successCb?: (data: T) => void,
            errorCb?: (err: any) => void
        ) => {
            setLoading(true);
            setError(null);

            try {
                const response: ApiResponse<T> = await apiRequest(config);
                if (!response.success) {
                    throw new Error(response.message || "API request failed");
                }

                successCb?.(response.data);

                return response.data;
            } catch (err: any) {
                const message =
                    err?.message || "Something went wrong";

                showAlert({
                    type: "error",
                    message,
                    showCancel: true,
                });

                setError(message);

                errorCb?.(err);
            } finally {
                setLoading(false);
            }
        },
        [showAlert]
    );

    useEffect(() => {
        const hasInvalidDependency = Array.isArray(dependencies) && dependencies?.some(
            (dependency) =>
                dependency === null ||
                dependency === undefined ||
                dependency === ""
        );

        if (!memoizedConfig || hasInvalidDependency) {
            return;
        }

        callApi(memoizedConfig, onSuccess, onError);


    }, [JSON.stringify(memoizedConfig), JSON.stringify(dependencies)]);

    return {
        callApi,
        loading,
        error,
    };
};