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
        }),
    });

    if (!response.ok) {
        throw new Error("Unable to save maintenance record.");
    }

    const savedRecord: MaintenanceRecordResponse = await response.json();

    return toMaintenanceRecord(savedRecord);
};