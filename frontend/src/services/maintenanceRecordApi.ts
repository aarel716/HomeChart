import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface MaintenanceRecordResponse {
    id: number;
    propertyId: number;
    categoryId: number;
    categoryName: string;
    title: string;
    description: string | null;
    completionDate: string;
    performedBy: "DIY" | "Contractor";
    isActive: boolean;
    cost: number;
    contractorId: number | null;
    contractorName: string | null;
}

const toMaintenanceRecord = (
    record: MaintenanceRecordResponse
): MaintenanceRecord => ({
    id: record.id,
    propertyId: record.propertyId,
    title: record.title,
    description: record.description ?? "",
    date: record.completionDate,
    category: record.categoryName,
    performedBy: record.performedBy,
    isActive: record.isActive,
    cost: record.cost,
    contractorId: record.contractorId,
    contractorName: record.contractorName,
});

export const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
    const response = await fetch("/api/maintenance-records");

    if (!response.ok) {
        throw new Error("Unable to load maintenance records.");
    }

    const records: MaintenanceRecordResponse[] = await response.json();

    return records.map(toMaintenanceRecord);
};

export const createMaintenanceRecord = async (
    values: NewMaintenanceRecord,
    propertyId: number,
    categoryId: number
): Promise<MaintenanceRecord> => {
    const response = await fetch("/api/maintenance-records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            propertyId,
            categoryId,
            title: values.title,
            description: values.description,
            completionDate: values.date,
            performedBy: values.performedBy,
            cost: values.cost,
            contractorId: values.contractorId,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to save maintenance record."));
    }

    const savedRecord: MaintenanceRecordResponse = await response.json();

    return toMaintenanceRecord(savedRecord);
};
export const updateMaintenanceRecord = async (
    recordId: number,
    values: NewMaintenanceRecord,
    propertyId: number
): Promise<MaintenanceRecord> => {
    const response = await fetch(`/api/maintenance-records/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            propertyId,
            categoryId: values.categoryId,
            title: values.title,
            description: values.description,
            completionDate: values.date,
            performedBy: values.performedBy,
            cost: values.cost,
            contractorId: values.contractorId,
        }),
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to update maintenance record."));
    }

    const savedRecord: MaintenanceRecordResponse = await response.json();
    return toMaintenanceRecord(savedRecord);
};

export const setMaintenanceRecordActive = async (
    recordId: number,
    isActive: boolean
): Promise<MaintenanceRecord> => {
    const response = await fetch(
        `/api/maintenance-records/${recordId}/active?isActive=${isActive}`,
        { method: "PATCH" }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Unable to update maintenance status."));
    }

    const savedRecord: MaintenanceRecordResponse = await response.json();
    return toMaintenanceRecord(savedRecord);
};

export const deleteMaintenanceRecord = async (
    recordId: number
): Promise<void> => {
    const response = await fetch(
        `/api/maintenance-records/${recordId}`,
        { method: "DELETE" }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to delete maintenance record.")
        );
    }
};

const getErrorMessage = async (
    response: Response,
    fallback: string
): Promise<string> => {
    try {
        const body: unknown = await response.json();
        if (body && typeof body === "object" && "detail" in body
            && typeof body.detail === "string") {
            return body.detail;
        }
    } catch {
        // A stopped backend or proxy may return a non-JSON response.
    }
    return fallback;
};
