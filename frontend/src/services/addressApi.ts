export interface AddressSuggestion {
    formatted: string;
    address_line1?: string;
    city?: string;
    state_code?: string;
    postcode?: string;
}

interface AddressResponse {
    results: AddressSuggestion[];
}

export const searchAddresses = async (
    text: string,
    signal: AbortSignal
): Promise<AddressSuggestion[]> => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error("Address lookup is not configured.");
    }

    const params = new URLSearchParams({
        text,
        apiKey,
        format: "json",
        filter: "countrycode:us",
        limit: "5",
    });

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params}`,
        {signal}
    );

    if (!response.ok) {
        throw new Error("Address lookup is unavailable.");
    }

    const data: AddressResponse = await response.json();
    return data.results;
};