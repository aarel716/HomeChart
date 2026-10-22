import type { NewProperty, Property } from "../types/Property";

export const getProperties = async (): Promise<Property[]> => {
    const response = await fetch("/api/properties");

    if (!response.ok) {
        throw new Error("Unable to load properties.");
    }

    return response.json();
};

export const createProperty = async (
    values: NewProperty,
    userId: number
): Promise<Property> => {
    const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...values,
            userId,
        }),
    });

    if (!response.ok) {
        throw new Error("Unable to create property.");
    }

    return response.json();
};