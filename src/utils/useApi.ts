import { useState } from "react"

type ApiResponse<T> = {
    message: string;
    data: T;
};

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callApi = async <T>(
        apiCall: Promise<ApiResponse<T>>,
        onSuccess?: (data: T) => void,
        onError?: (err: any) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall;

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