import { useState, useCallback } from "react"
import { useAlert } from "../../components/CustomAlert/AlertContext";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL


type ApiResponse<T> = {
    success: boolean;
    data: T;
    message: string;
};


type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"


export type ApiRequestOptions = {
    method?: HttpMethod
    endpoint: string
    body?: unknown
    token?: string
}






export const apiRequest = async <T>({
    method = "GET",
    endpoint,
    body,
}: ApiRequestOptions): Promise<T> => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.message || "API request failed")
    }
    return data
}







export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert()
    const callApi = useCallback(async <T>(
        apiConfig: ApiRequestOptions,
        onSuccess?: (data: T) => void,
        onError?: (err: any) => void
    ) => {
        setLoading(true);
        setError(null);

        try {
            const response: ApiResponse<T> = await apiRequest(apiConfig);
            if (!response.success) {
                throw new Error(response.message || "API request failed");
            }

            // ✅ extract data here
            onSuccess?.(response.data);

            return response.data;
        } catch (err: any) {
            console.log("Error")
            const message = err?.message || "Something went wrong";
            setError(message);
            showAlert({
                type: "error",
                message: message,
                showCancel: true,
            })
            onError?.(err);
        } finally {
            setLoading(false);
        }
    }, [showAlert]);

    return { callApi, loading, error };
};