import { useState } from "react";
import { User } from "./hooks/types";
import { useApi } from "./hooks/useApi";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL



export interface LoginResponse {
    token: string;
    user: User;
}

export const saveAuthData = (response: LoginResponse) => {
    const user = response.user
    // const {organizationMemberships, ...remainingUser} = user
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", response.token);
};

export const clearAuthData = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

export const getAuthUser = (): any => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
};

export const getAuthOrganization = (): any => {
    const orgStr = localStorage.getItem("organization");
    return orgStr ? JSON.parse(orgStr) : null;
};

type SignupPayload = {
    name: string
    email: string
    password: string
}

type SignupResponse = {
    user: User
}

export const useSignup = () => {
    const [user, setUser] =
        useState<SignupResponse["data"]["user"]>()

    const { callApi, loading } = useApi()

    const signup = (
        payload: SignupPayload,
        onSuccess?: (data: SignupResponse) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<SignupResponse>(
            {
                endpoint: "/users/create",
                method: "POST",
                body: payload,
            },
            (data) => {
                setUser(data?.user)

                onSuccess?.(data)
            },
            (err) => {
                console.error(err.message)

                onError?.(err)
            }
        )
    }

    return {
        signup,
        user,
        loading,
    }
}