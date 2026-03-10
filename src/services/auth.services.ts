type LoginPayload = {
    email: string
    password: string
}

type SignupPayload = {
    name: string
    email: string
    password: string
}

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

export const loginApi = async (data: LoginPayload) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.message || "Login failed")
    }

    return result
}

export const signupApi = async (data: SignupPayload) => {
    const res = await fetch(`${BASE_URL}/users/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.message || "Signup failed")
    }

    return result
}