import { useEffect, useState } from "react";
import { getContractors, saveContractor, setContractorActive } from "../services/contractorApi.ts";
import type { Contractor, NewContractor } from "../types/Contractor.ts";

export const useContractors = () => {
    const [contractors, setContractors] = useState<Contractor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        const loadContractors = async () => {
            try {
                const data = await getContractors();
                if (!cancelled) setContractors(data);
            } catch {
                if (!cancelled) setError("Unable to load contractors. Refresh to try again.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        loadContractors();
        return () => { cancelled = true; };
    }, []);

    const addContractor = async (values: NewContractor): Promise<Contractor> => {
        const saved = await saveContractor(values);
        setContractors((previous) => [...previous, saved]);
        return saved;
    };

    const updateContractor = async (id: number, values: NewContractor): Promise<void> => {
        const saved = await saveContractor(values, id);
        setContractors((previous) => previous.map((item) => item.id === id ? saved : item));
    };

    const changeContractorStatus = async (id: number, isActive: boolean): Promise<void> => {
        const saved = await setContractorActive(id, isActive);
        setContractors((previous) => previous.map((item) => item.id === id ? saved : item));
    };

    return { contractors, isLoading, error, addContractor, updateContractor, changeContractorStatus };
};
