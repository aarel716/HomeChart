import { demoUserId } from "../data/demoConfig";
import type { Contractor, NewContractor } from "../types/Contractor";

const readResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let message = "Unable to update contractors. Please try again.";
        try {
            const body: unknown = await response.json();
            if (body && typeof body === "object" && "detail" in body
                && typeof body.detail === "string") {
                message = body.detail;
            }
        } catch {
            // Use the default message if the server is unavailable.
        }
        throw new Error(message);
    }
    return response.json();
};

export const getContractors = async (): Promise<Contractor[]> =>
    readResponse(await fetch(`/api/contractors?userId=${demoUserId}`));

export const saveContractor = async (
    values: NewContractor,
    contractorId?: number
): Promise<Contractor> => readResponse(await fetch(
    contractorId ? `/api/contractors/${contractorId}` : "/api/contractors",
    {
        method: contractorId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, userId: demoUserId }),
    }
));

export const setContractorActive = async (
    contractorId: number,
    isActive: boolean
): Promise<Contractor> => readResponse(await fetch(
    `/api/contractors/${contractorId}/active?userId=${demoUserId}&isActive=${isActive}`,
    { method: "PATCH" }
));
