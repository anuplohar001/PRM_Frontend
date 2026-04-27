import { useEffect, useState } from "react";
import { apiRequest, type ApiRequestOptions } from "../services/api.services";

type ApiResponse<T> = {
    message: string;
    data: T;
};

export const useApiOnLoad = <T>(
    initialConfig: ApiRequestOptions,
    onSuccess?: (data: T) => void,
    onError?: (err: any) => void
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = async (
        config: ApiRequestOptions,
        successCb?: (data: T) => void,
        errorCb?: (err: any) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response: ApiResponse<T> = await apiRequest(config);
            successCb?.(response.data);
            return response.data;
        } catch (err: any) {
            const message = err?.message || "Something went wrong";
            setError(message);
            errorCb?.(err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Runs on first render
    useEffect(() => {
        if (initialConfig) {
            callApi(initialConfig, onSuccess, onError);
        }
    }, [initialConfig.body, initialConfig.endpoint]);

    return { callApi, loading, error };
};