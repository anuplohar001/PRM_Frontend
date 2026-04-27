import { useState } from "react"
import { apiRequest, type ApiRequestOptions } from "../services/api.services";

type ApiResponse<T> = {
    message: string;
    data: T;
};

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = async <T>(
        apiConfig: ApiRequestOptions,
        onSuccess?: (data: T) => void,
        onError?: (err: any) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response: ApiResponse<T> = await apiRequest(apiConfig);

            // ✅ extract data here
            onSuccess?.(response.data);

            return response.data;
        } catch (err: any) {
            const message = err?.message || "Something went wrong";
            setError(message);
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    return { callApi, loading, error };
};