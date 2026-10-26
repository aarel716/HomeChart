import {useEffect, useState} from "react";
// import {getProperties} from "../services/propertyApi";
import type {NewProperty, Property} from "../types/Property";
import {createProperty, getProperties, updatePropertyStatus} from "../services/propertyApi";
import {demoUserId} from "../data/demoConfig";


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

    const setPropertyActive = async (
        propertyId: number,
        isActive: boolean
    ): Promise<void> => {
        const savedProperty = await updatePropertyStatus(
            propertyId,
            isActive
        );

        setProperties((previousProperties) =>
            previousProperties.map((property) =>
                property.id === propertyId ? savedProperty : property
            )
        );
    };

    const archiveProperty = async (propertyId: number): Promise<void> => {
        await setPropertyActive(propertyId, false);
    };

    const restoreProperty = async (propertyId: number): Promise<void> => {
        await setPropertyActive(propertyId, true);
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