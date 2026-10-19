import type { MaintenanceRecord } from "../types/MaintenanceRecord";

export const maintenanceCategories = [
    "HVAC",
    "Plumbing",
    "Electrical",
    "Roofing",
    "Appliances",
    "Landscaping",
    "General Maintenance",
];
export const propertyTypes = [
    "Single Family Home",
    "Condo",
    "Townhouse",
    "Multi-Family Home",
    "Other",
];

export const sampleProperties = [
    {
        id: 1,
        address: "123 Example Lane",
        city: "Austin",
        state: "TX",
        yearBuilt: 2008,
        propertyType: "Single Family Home",
        isActive: true,
    },
    {
        id: 2,
        address: "456 Sample Street",
        city: "Savannah",
        state: "GA",
        yearBuilt: 2012,
        propertyType: "Rental Home",
        isActive: true,

    },
];

export const sampleRecords: MaintenanceRecord[] = [
    {
        id: 1,
        propertyId: 1,
        title: "HVAC Service",
        date: "2026-09-12",
        cost: 185,
        description: "Annual HVAC inspection and servicing.",
        category: "HVAC",
        performedBy: "Contractor",
        isActive: true,
    },
    {
        id: 2,
        propertyId: 1,
        title: "Roof Inspection",
        date: "2026-08-20",
        cost: 250,
        description: "Inspected roof for damage and leaks.",
        category: "Roofing",
        performedBy: "Contractor",
        isActive: true,
    },
    {
        id: 3,
        propertyId: 2,
        title: "Water Heater Repair",
        date: "2026-07-10",
        cost: 420,
        description: "Replaced faulty heating element.",
        category: "Plumbing",
        performedBy: "Contractor",
        isActive: true,
    },

];