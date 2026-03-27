import { useState } from "react"

type ApiRequestConfig = {
    endpoint: string
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: unknown
    data?: any
}

export const useApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const callApi = async <T = any>(
        requestFn: (config: ApiRequestConfig) => Promise<T>,
        config: ApiRequestConfig,
        onSuccess?: (data: T) => void,
        onError?: (err: any) => void
    ) => {
        setLoading(true)
        setError(null)

        try {
            const response = await requestFn(config)
            onSuccess?.(response)
            return response
        } catch (err: any) {
            const message = err?.message || "Something went wrong"
            setError(message)
            onError?.(err)
        } finally {
            setLoading(false)
        }
    }

    return { callApi, loading, error }
}