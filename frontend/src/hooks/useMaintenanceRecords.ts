import { useEffect, useState } from "react";
import {
    createMaintenanceRecord,
    getMaintenanceRecords,
} from "../services/maintenanceRecordApi";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

export const useMaintenanceRecords = () => {
    const [records, setRecords] = useState<MaintenanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadRecords = async () => {
            try {
                const data = await getMaintenanceRecords();

                if (!cancelled) {
                    setRecords(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load maintenance records.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadRecords();

        return () => {
            cancelled = true;
        };
    }, []);

    const addRecord = async (
        values: NewMaintenanceRecord,
        propertyId: number
    ): Promise<void> => {
        const savedRecord = await createMaintenanceRecord(
            values,
            propertyId,
            values.categoryId
        );

        setRecords((previousRecords) => [
            savedRecord,
            ...previousRecords,
        ]);
    };

    const updateRecord = (
        recordId: number,
        values: NewMaintenanceRecord
    ) => {
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId
                    ? { ...record, ...values }
                    : record
            )
        );
    };

    const archiveRecord = (recordId: number) => {
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId
                    ? { ...record, isActive: false }
                    : record
            )
        );
    };

    return {
        records,
        isLoading,
        error,
        addRecord,
        updateRecord,
        archiveRecord,
    };
};