import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import AddressAutocomplete from "./AddressAutocomplete";
import { propertyTypes } from "../data/sampleData";
import type { AddressSuggestion } from "../services/addressApi";
import type { NewProperty } from "../types/Property";

interface PropertyModalProps {
    show: boolean;
    darkMode: boolean;
    onClose: () => void;
    onSave: (property: NewProperty) => Promise<void>;
}

const emptyAddress = {
    address: "",
    city: "",
    state: "",
    zipCode: "",
};

const PropertyModal = ({
                           show,
                           darkMode,
                           onClose,
                           onSave,
                       }: PropertyModalProps) => {
    const [error, setError] = useState("");
    const [addressFields, setAddressFields] = useState(emptyAddress);
    const currentYear = new Date().getFullYear();
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = () => {
        setError("");
        setAddressFields(emptyAddress);
    };

    const handleClose = () => {
        if(!isSaving) {
            onClose();
        }
    };

    const handleAddressSelect = (suggestion: AddressSuggestion) => {
        setAddressFields({
            address: suggestion.address_line1 ?? "",
            city: suggestion.city ?? "",
            state: suggestion.state_code?.toUpperCase() ?? "",
            zipCode: suggestion.postcode ?? "",
        });
        setError("");
    };

    const updateAddressField = (
        field: keyof typeof emptyAddress,
        value: string
    ) => {
        setAddressFields((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(isSaving) {
            return;
        }

        const data = new FormData(event.currentTarget);

        const property: NewProperty = {
            address: addressFields.address.trim(),
            city: addressFields.city.trim(),
            state: addressFields.state.trim().toUpperCase(),
            zipCode: addressFields.zipCode.trim(),
            yearBuilt: Number(data.get("yearBuilt")),
            propertyType: String(data.get("propertyType") ?? ""),
        };

        if (!property.address || !property.city) {
            setError("Enter an address and city.");
            return;
        }

        if (!/^[A-Z]{2}$/.test(property.state)) {
            setError("Enter a two-letter state abbreviation, such as TX.");
            return;
        }

        if (
            property.zipCode &&
            !/^\d{5}(-\d{4})?$/.test(property.zipCode)
        ) {
            setError("Enter a ZIP code such as 78701 or 78701-1234.");
            return;
        }

        if (
            !Number.isInteger(property.yearBuilt) ||
            property.yearBuilt < 1000 ||
            property.yearBuilt > currentYear
        ) {
            setError(`Enter a year between 1000 and ${currentYear}.`);
            return;
        }

        if (!propertyTypes.includes(property.propertyType)) {
            setError("Select a property type.");
            return;
        }

        setError("");
        setIsSaving(true);

        try{
            await onSave(property);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to save property. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            onExited={resetForm}
            data-bs-theme={darkMode ? "dark" : "light"}
            aria-labelledby="property-modal-title"
            centered
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title id="property-modal-title">
                    Add Property
                </Modal.Title>
            </Modal.Header>

            <Form
                onSubmit={handleSubmit}
                className="d-flex flex-column"
                style={{ minHeight: 0, overflow: "hidden" }}
                >
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <AddressAutocomplete onSelect={handleAddressSelect} />

                    <Form.Group className="mb-3" controlId="property-address">
                        <Form.Label>Street address</Form.Label>
                        <Form.Control
                            name="address"
                            value={addressFields.address}
                            onChange={(event) =>
                                updateAddressField("address", event.target.value)
                            }
                            autoComplete="address-line1"
                            maxLength={200}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="property-city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            name="city"
                            value={addressFields.city}
                            onChange={(event) =>
                                updateAddressField("city", event.target.value)
                            }
                            autoComplete="address-level2"
                            maxLength={100}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="property-state">
                        <Form.Label>State abbreviation</Form.Label>
                        <Form.Control
                            name="state"
                            value={addressFields.state}
                            onChange={(event) =>
                                updateAddressField(
                                    "state",
                                    event.target.value.toUpperCase()
                                )
                            }
                            autoComplete="address-level1"
                            minLength={2}
                            maxLength={2}
                            pattern="[A-Za-z]{2}"
                            placeholder="TX"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="property-zip">
                        <Form.Label>ZIP code (optional)</Form.Label>
                        <Form.Control
                            name="zipCode"
                            value={addressFields.zipCode}
                            onChange={(event) =>
                                updateAddressField("zipCode", event.target.value)
                            }
                            autoComplete="postal-code"
                            maxLength={10}
                            pattern="[0-9]{5}(-[0-9]{4})?"
                            placeholder="78701"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="property-year">
                        <Form.Label>Year built</Form.Label>
                        <Form.Control
                            name="yearBuilt"
                            type="number"
                            min={1000}
                            max={currentYear}
                            step={1}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="property-type">
                        <Form.Label>Property type</Form.Label>
                        <Form.Select
                            name="propertyType"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>
                                Select a property type
                            </option>

                            {propertyTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>

                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Property"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PropertyModal;