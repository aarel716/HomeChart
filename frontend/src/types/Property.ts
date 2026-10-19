export interface Property {
    id: number;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    yearBuilt: number;
    propertyType: string;
    isActive: boolean;
}

export type NewProperty = Omit<Property, "id">;