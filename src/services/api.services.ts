type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiRequestOptions = {
    method?: HttpMethod
    endpoint: string
    body?: unknown
    token?: string
}

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

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



export const getRecords = async <T>({
    endpoint = "/getRecords",
    body,
}: ApiRequestOptions): Promise<T> => {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
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
// await apiRequest({
//     method: "POST",
//     endpoint: "/users/login",
//     body: {
//         email: "test@email.com",
//         password: "123456"
//     }
// })