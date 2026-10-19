import { useState } from "react";
import { sampleProperties } from "../data/sampleData";
import type { NewProperty, Property } from "../types/Property";

export const useProperties = () => {
    const [properties, setProperties] =
        useState<Property[]>(sampleProperties);

    const addProperty = (values: NewProperty) => {
        setProperties((previousProperties) => {
            const nextId =
                Math.max(
                    0,
                    ...previousProperties.map((property) => property.id)
                ) + 1;

            return [
                ...previousProperties,
                { ...values, id: nextId, isActive: true },
            ];
        });
    };

    const setPropertyActive = (
        propertyId: number,
        isActive: boolean
    ) => {
        setProperties((previousProperties) =>
            previousProperties.map((property) =>
                property.id === propertyId
                    ? { ...property, isActive }
                    : property
            )
        );
    };

    const archiveProperty = (propertyId: number) => {
        setPropertyActive(propertyId, false);
    };

    const restoreProperty = (propertyId: number) => {
        setPropertyActive(propertyId, true);
    };

    return {
        properties,
        addProperty,
        archiveProperty,
        restoreProperty,
    };
};