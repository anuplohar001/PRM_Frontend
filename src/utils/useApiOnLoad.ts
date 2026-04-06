import { useEffect, useState } from "react";

type ApiResponse<T> = {
    message: string;
    data: T;
};

export const useApiOnLoad = <T>(
    initialApiCall?: () => Promise<ApiResponse<T>>,
    onSuccess?: (data: T) => void,
    onError?: (err: any) => void
) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = async (
        apiCall: Promise<ApiResponse<T>>,
        successCb?: (data: T) => void,
        errorCb?: (err: any) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall;
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
        if (initialApiCall) {
            callApi(initialApiCall(), onSuccess, onError);
        }
    }, []);

    return { callApi, loading, error };
};