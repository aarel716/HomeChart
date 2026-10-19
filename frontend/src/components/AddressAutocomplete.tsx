import { useEffect, useState } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { searchAddresses } from "../services/addressApi";
import type { AddressSuggestion } from "../services/addressApi";

interface AddressAutocompleteProps {
    onSelect: (address: AddressSuggestion) => void;
}

const AddressAutocomplete = ({
                                 onSelect,
                             }: AddressAutocompleteProps) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] =
        useState<AddressSuggestion[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (query.trim().length < 3) {
            return;
        }

        const controller = new AbortController();

        const timeout = window.setTimeout(async () => {
            setMessage("Searching addresses...");

            try {
                const results = await searchAddresses(
                    query.trim(),
                    controller.signal
                );

                if (controller.signal.aborted) {
                    return;
                }

                setSuggestions(results);
                setMessage(
                    results.length
                        ? "Choose a suggestion below."
                        : "No matches. Try adding the city, or enter the address manually."
                );
            } catch {
                if (!controller.signal.aborted) {
                    setMessage(
                        "Address lookup is unavailable. Enter the address manually below."
                    );
                }
            }
        }, 400);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    const handleChange = (value: string) => {
        setQuery(value);
        setSuggestions([]);
        setMessage("");
    };

    const handleSelect = (suggestion: AddressSuggestion) => {
        onSelect(suggestion);
        setQuery("");
        setSuggestions([]);
        setMessage("Address filled in. Review the fields below.");
    };

    return (
        <div className="mb-4">
            <Form.Group controlId="address-search">
                <Form.Label>Find your address</Form.Label>

                <Form.Control
                    type="search"
                    value={query}
                    onChange={(event) => handleChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                        }
                    }}
                    placeholder="Start typing your street address"
                    autoComplete="off"
                    aria-describedby="address-search-help"
                />

                <Form.Text id="address-search-help">
                    Search US addresses, or fill in the fields below manually.
                    Use Tab to move through suggestions and Enter to select.
                </Form.Text>
            </Form.Group>

            <div role="status" className="small mt-2">
                {message}
            </div>

            {suggestions.length > 0 && (
                <ListGroup className="mt-2" aria-label="Address suggestions">
                    {suggestions.map((suggestion, index) => (
                        <ListGroup.Item
                            key={`${suggestion.formatted}-${index}`}
                            action
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.formatted}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <div className="small mt-2">
                Powered by{" "}
                <a href="https://www.geoapify.com/">Geoapify</a>
                {" · "}
                <a href="https://www.openstreetmap.org/copyright">
                    © OpenStreetMap contributors
                </a>
            </div>
        </div>
    );
};

export default AddressAutocomplete;