import { useState } from "react";
import { useApi } from "./hooks/useApi";

export interface AddOrganizationMemberPayload {
    organizationId: number;
    memberId: number;
}

export interface AddOrganizationMemberResponse {
    success: boolean;
    message: string;
    organizationMember: {
        id: number;
        organizationId: number;
        userId: number;
    };
}

export const useAddOrganizationMember = () => {
    const [organizationMember, setOrganizationMember] = useState<AddOrganizationMemberResponse["organizationMember"]>();

    const { callApi, loading } = useApi();

    const addOrganizationMember = (
        payload: AddOrganizationMemberPayload,
        onSuccess?: (
            data: AddOrganizationMemberResponse
        ) => void,
        onError?: (error: Error) => void
    ) => {
        callApi<AddOrganizationMemberResponse>(
            {
                endpoint: "/organizations/add-member",
                method: "POST",
                body: payload,
            },
            (data) => {
                setOrganizationMember(
                    data?.organizationMember
                );

                onSuccess?.(data);
            },
            (err) => {
                console.error(err.message);

                onError?.(err);
            }
        );
    };

    return {
        addOrganizationMember,
        organizationMember,
        loading,
    };
};