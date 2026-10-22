import {useEffect, useState} from "react";
// import {getProperties} from "../services/propertyApi";
import type {NewProperty, Property} from "../types/Property";
import { createProperty, getProperties } from "../services/propertyApi";
import { demoUserId } from "../data/demoConfig";

export const useProperties = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const loadProperties = async () => {
            try {
                const data = await getProperties();

                if (!cancelled) {
                    setProperties(data);
                }
            } catch {
                if (!cancelled) {
                    setError("Unable to load properties. Please try refreshing.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        loadProperties();
        return () => {
            cancelled = true;
        };
    }, []);

    const addProperty = async (values: NewProperty): Promise<void> => {
        const savedProperty = await createProperty(values, demoUserId);

        setProperties((previousProperties) => [
            ...previousProperties,
            savedProperty,
        ]);
    };

    const setPropertyActive = (
        propertyId: number,
        isActive: boolean
    ) => {
        setProperties((previousProperties) =>
            previousProperties.map((property) =>
                property.id === propertyId
                    ? {...property, isActive}
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
        isLoading,
        error,
        addProperty,
        archiveProperty,
        restoreProperty,
    };
};