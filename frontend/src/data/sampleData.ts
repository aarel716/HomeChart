import type { MaintenanceRecord } from "../types/MaintenanceRecord";
export const sampleProperty = {
    address: "123 Example Lane",
    city: "Austin",
    state: "TX",
    yearBuilt: 2008,
    propertyType: "Single Family Home",
};

export const sampleRecords: MaintenanceRecord[] = [
    {
        id: 1,
        title: "HVAC Service",
        date: "2026-09-12",
        cost: 185,
        description: "Annual HVAC inspection and servicing.",
    },
    {
        id: 2,
        title: "Roof Inspection",
        date: "2026-08-20",
        cost: 250,
        description: "Inspected roof for damage and leaks.",
    },
    {
        id: 3,
        title: "Water Heater Repair",
        date: "2026-07-10",
        cost: 420,
        description: "Replaced faulty heating element.",
    },
];