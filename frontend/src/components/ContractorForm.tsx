import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useMaintenanceCategories } from "../hooks/useMaintenanceCategories";
import type { Contractor, NewContractor } from "../types/Contractor";

interface ContractorFormProps {
    initialContractor?: Contractor;
    onSave: (values: NewContractor) => Promise<void>;
    onCancel: () => void;
    onSavingChange: (isSaving: boolean) => void;
    cancelLabel?: string;
}

const ContractorForm = ({ initialContractor, onSave, onCancel, onSavingChange,
    cancelLabel = "Cancel" }: ContractorFormProps) => {
    const { categories, isLoading, error: categoryError } = useMaintenanceCategories();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;
        const data = new FormData(event.currentTarget);
        const name = String(data.get("name") ?? "").trim();
        const categoryId = Number(data.get("categoryId"));
        if (!name || !categories.some((category) => category.id === categoryId)) {
            setError("Enter a name and select a specialty.");
            return;
        }
        setError("");
        setIsSaving(true);
        onSavingChange(true);
        try {
            await onSave({ name, categoryId,
                phone: String(data.get("phone") ?? "").trim(),
                email: String(data.get("email") ?? "").trim() });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to save contractor.");
        } finally {
            setIsSaving(false);
            onSavingChange(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {categoryError && <Alert variant="danger">{categoryError}</Alert>}
            {isLoading && <p role="status">Loading specialties...</p>}
            <fieldset disabled={isSaving || isLoading || !!categoryError || categories.length === 0}>
                <legend className="visually-hidden">Contractor details</legend>
                <Form.Group className="mb-3" controlId="contractor-name">
                    <Form.Label>Name or company</Form.Label>
                    <Form.Control name="name" defaultValue={initialContractor?.name ?? ""}
                        maxLength={100} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contractor-category">
                    <Form.Label>Specialty</Form.Label>
                    <Form.Select name="categoryId" defaultValue={initialContractor?.categoryId ?? ""} required>
                        <option value="" disabled>Select a specialty</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="contractor-phone">
                    <Form.Label>Phone (optional)</Form.Label>
                    <Form.Control type="tel" name="phone" maxLength={30}
                        defaultValue={initialContractor?.phone ?? ""} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="contractor-email">
                    <Form.Label>Email (optional)</Form.Label>
                    <Form.Control type="email" name="email" maxLength={254}
                        defaultValue={initialContractor?.email ?? ""} />
                </Form.Group>
                <Button type="submit">{isSaving ? "Saving..." : "Save Contractor"}</Button>
            </fieldset>
            <Button className="mt-3" variant="secondary" onClick={onCancel} disabled={isSaving}>
                {cancelLabel}
            </Button>
        </Form>
    );
};

export default ContractorForm;
