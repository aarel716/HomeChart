import { useEffect, useState } from "react";
import type { MaintenanceCategory } from "../types/MaintenanceCategory";
import { getMaintenanceCategories } from "../services/maintenanceCategoryApi";

export const useMaintenanceCategories = () => {
    const [categories, setCategories] = useState<MaintenanceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadCategories = async () => {
            try {
                const data = await getMaintenanceCategories();

                if (!cancelled) {
                    setCategories(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load maintenance categories.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    return { categories, isLoading, error };
};