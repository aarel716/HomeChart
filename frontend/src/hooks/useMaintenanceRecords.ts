import {useState} from "react";
import {sampleRecords} from "../data/sampleData";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

export const useMaintenanceRecords = () => {
    const [records, setRecords] =
        useState<MaintenanceRecord[]>(sampleRecords);

    const addRecord = (
        values: NewMaintenanceRecord,
        propertyId: number
    ) => {
        setRecords((previousRecords) => {
            const nextId =
                Math.max(0, ...previousRecords.map((record) => record.id)) + 1;

            const newRecord: MaintenanceRecord = {
                ...values,
                id: nextId,
                propertyId,
                isActive: true,
            };

            return [newRecord, ...previousRecords];
        });
    };

    const updateRecord = (
        recordId: number,
        values: NewMaintenanceRecord
    ) => {
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId
                    ? {...record, ...values}
                    : record
            )
        );
    };

    const archiveRecord = (recordId: number) => {
        setRecords((previousRecords) =>
            previousRecords.map((record) =>
                record.id === recordId
                    ? {...record, isActive: false}
                    : record
            )
        );
    };

    return {
        records,
        addRecord,
        updateRecord,
        archiveRecord,
    };
};