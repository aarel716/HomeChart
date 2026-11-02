import { useEffect, useState } from "react";
import {
    archiveMaintenanceRecord,
    createMaintenanceRecord,
    updateMaintenanceRecord,
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

    const updateRecord = async (
        recordId: number,
        values: NewMaintenanceRecord
    ): Promise<void> => {
        const existingRecord = records.find((record) => record.id === recordId);
        if (!existingRecord) {
            throw new Error("Maintenance record not found. Refresh and try again.");
        }

        const savedRecord = await updateMaintenanceRecord(
            recordId, values, existingRecord.propertyId
        );
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId ? savedRecord : record
            )
        );
    };

    const archiveRecord = async (recordId: number): Promise<void> => {
        const savedRecord = await archiveMaintenanceRecord(recordId);
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId ? savedRecord : record
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