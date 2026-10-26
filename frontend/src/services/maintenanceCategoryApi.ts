import type { MaintenanceCategory } from "../types/MaintenanceCategory";

export const getMaintenanceCategories = async (): Promise<MaintenanceCategory[]> => {
    const response = await fetch("/api/maintenance-categories");

    if (!response.ok) {
        throw new Error("Unable to load maintenance categories.");
    }

    return response.json();
};