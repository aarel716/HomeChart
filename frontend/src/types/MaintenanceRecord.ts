export interface MaintenanceRecord {
    id: number;
    propertyId: number;
    title: string;
    date: string;
    cost: number;
    description: string;
    category: string;
    performedBy: "DIY" | "Contractor";
    isActive: boolean;
}

export type NewMaintenanceRecord = Omit<
    MaintenanceRecord,
    "id" | "propertyId" | "isActive"
>;