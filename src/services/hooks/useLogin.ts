import { useState } from "react";
import { LoginResponse, saveAuthData } from "../auth.service";
import { apiRequest } from "./useApi";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/components/CustomAlert/AlertContext";

interface ApiLoginResponse {
    success: boolean;
    data: LoginResponse;
    message: string;
}

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {showAlert } = useAlert()
    
    const login = async (email: string, password: string): Promise<LoginResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest<ApiLoginResponse>({
                method: "POST",
                endpoint: "/users/login",
                body: { email, password }
            });

            if (!response.success) {
                throw new Error(response.message || "Login failed");
            }

            saveAuthData(response.data); 

            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Login failed";
            showAlert({
                type: "error",
                message: message,
                showCancel: true
            })
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error };
};