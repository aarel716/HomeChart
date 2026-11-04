import { useState } from "react";
import type { Contractor, NewContractor } from "../types/Contractor.ts";
import type { FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import ContractorForm from "./ContractorForm";
import { useMaintenanceCategories } from "../hooks/useMaintenanceCategories";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface MaintenanceFormProps {
    initialRecord?: MaintenanceRecord;
    contractors: Contractor[];
    contractorsLoading: boolean;
    contractorsError: string;
    onAddContractor: (values: NewContractor) => Promise<Contractor>;
    isSaving: boolean;
    onContractorSavingChange: (isSaving: boolean) => void;
    onSave: (record: NewMaintenanceRecord) => Promise<void>;
}

const MaintenanceForm = ({
                             contractors,
                             contractorsLoading,
                             contractorsError,
                             onAddContractor,
                             initialRecord,
                             isSaving,
                             onContractorSavingChange,
                             onSave,
                         }: MaintenanceFormProps) => {
    const [error, setError] = useState("");
    const [performedBy, setPerformedBy] = useState(initialRecord?.performedBy ?? "DIY");
    const [contractorId, setContractorId] = useState(String(initialRecord?.contractorId ?? ""));
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const keepUnrecorded = initialRecord?.performedBy === "Contractor" && !initialRecord.contractorId;
    const availableContractors = contractors.filter((item) => item.isActive || item.id === initialRecord?.contractorId);
    const handleAddContractor = async (values: NewContractor) => {
        const saved = await onAddContractor(values);
        setContractorId(String(saved.id));
        setShowQuickAdd(false);
    };
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const {
        categories,
        isLoading,
        error: categoryError,
    } = useMaintenanceCategories();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSaving) {
            return;
        }

        const data = new FormData(event.currentTarget);

        const title = String(data.get("title") ?? "").trim();
        const category = String(data.get("category") ?? "");
        const rawCost = String(data.get("cost") ?? "").trim();
        const cost = Number(rawCost);
        const date = String(data.get("date") ?? "");

        if (!title) {
            setError("Enter a maintenance title.");
            return;
        }

        const selectedCategory = categories.find(
            (item) => item.name === category
        );

        if (!selectedCategory) {
            setError("Select a maintenance category.");
            return;
        }

        if (performedBy !== "DIY" && performedBy !== "Contractor") {
            setError("Select who performed the work.");
            return;
        }

        if (performedBy === "Contractor" && (contractorsLoading || contractorsError
            || (!contractorId && !keepUnrecorded))) {
            setError(contractorsError || "Select a contractor before saving.");
            return;
        }

        if (!date || date > today) {
            setError("Choose today or an earlier completion date.");
            return;
        }

        if (!rawCost || !Number.isFinite(cost) || cost < 0 || cost > 99999999.99
            || !/^\d+(\.\d{1,2})?$/.test(rawCost)) {
            setError("Enter a cost from 0 to 99,999,999.99 with at most two decimal places.");
            return;
        }

        setError("");

        try {
            await onSave({
                title,
                category,
                categoryId: selectedCategory.id,
                performedBy,
                contractorId: performedBy === "Contractor" && contractorId ? Number(contractorId) : null,
                cost,
                date,
                description: String(data.get("description") ?? "").trim(),
            });
        } catch (error) {
            setError(error instanceof Error
                ? error.message : "Unable to save. Check your connection and try again.");
        }
    };

    if (isLoading) {
        return <p role="status">Loading maintenance categories...</p>;
    }

    if (categoryError) {
        return <Alert variant="danger">{categoryError}</Alert>;
    }

    if (categories.length === 0) {
        return (
            <Alert variant="warning">
                No maintenance categories are available.
            </Alert>
        );
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} hidden={showQuickAdd}>
                <fieldset disabled={isSaving}>
                    <legend className="visually-hidden">
                        Maintenance record details
                    </legend>

                    <Form.Group
                        className="mb-3"
                        controlId="maintenance-title"
                    >
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            name="title"
                            type="text"
                            defaultValue={initialRecord?.title ?? ""}
                            maxLength={100}
                            required
                        />
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="maintenance-category"
                    >
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category"
                            defaultValue={initialRecord?.category ?? ""}
                            required
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.name}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <fieldset className="mb-3">
                        <legend className="fs-6">
                            Who performed the work?
                        </legend>
                        <Form.Check
                            inline
                            type="radio"
                            id="performed-by-diy"
                            name="performedBy"
                            label="DIY"
                            value="DIY"
                            checked={performedBy === "DIY"}
                            onChange={() => setPerformedBy("DIY")}
                            required
                        />
                        <Form.Check
                            inline
                            type="radio"
                            id="performed-by-contractor"
                            name="performedBy"
                            label="Contractor"
                            value="Contractor"
                            checked={performedBy === "Contractor"}
                            onChange={() => setPerformedBy("Contractor")}
                            required
                        />
                    </fieldset>

                    {performedBy === "Contractor" && (
                        <Form.Group className="mb-3" controlId="maintenance-contractor">
                            <Form.Label>Contractor</Form.Label>
                            {contractorsLoading && <p role="status">Loading contractors...</p>}
                            {contractorsError && <Alert variant="danger">{contractorsError}</Alert>}
                            <Form.Select value={contractorId} onChange={(event) => setContractorId(event.target.value)}
                                         disabled={contractorsLoading || !!contractorsError} required={!keepUnrecorded}>
                                <option value="">{keepUnrecorded ? "Not recorded (older record)" : "Select a contractor"}</option>
                                {availableContractors.map((contractor) => (
                                    <option key={contractor.id} value={contractor.id}>
                                        {contractor.name} — {contractor.categoryName}{!contractor.isActive ? " (archived)" : ""}
                                    </option>
                                ))}
                            </Form.Select>
                            <Button className="mt-2" variant="outline-primary" onClick={() => setShowQuickAdd(true)}
                                    disabled={contractorsLoading || !!contractorsError}>Add Contractor</Button>
                        </Form.Group>
                    )}

                    <Form.Group
                        className="mb-3"
                        controlId="maintenance-date"
                    >
                        <Form.Label>Completion date</Form.Label>
                        <Form.Control
                            name="date"
                            type="date"
                            max={today}
                            defaultValue={initialRecord?.date ?? ""}
                            required
                        />
                        <Form.Text className="text-body-secondary">
                            Use today’s date or an earlier date.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="maintenance-cost"
                    >
                        <Form.Label>Total cost ($)</Form.Label>
                        <Form.Control
                            name="cost"
                            type="number"
                            defaultValue={initialRecord?.cost ?? ""}
                            min="0"
                            max="99999999.99"
                            step="0.01"
                            required
                        />
                        <Form.Text className="text-body-secondary">
                            Enter 0 if there was no cost.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="maintenance-description"
                    >
                        <Form.Label>Description (optional)</Form.Label>
                        <Form.Control
                            name="description"
                            as="textarea"
                            defaultValue={initialRecord?.description ?? ""}
                            rows={3}
                            maxLength={1000}
                        />
                    </Form.Group>

                    <Button type="submit" disabled={isSaving}>
                        {isSaving
                            ? "Saving..."
                            : initialRecord
                                ? "Save Changes"
                                : "Save Record"}
                    </Button>
                </fieldset>
            </Form>
            {showQuickAdd && (
                <section>
                    <h3>Add Contractor</h3>
                    <ContractorForm onSave={handleAddContractor} onCancel={() => setShowQuickAdd(false)}
                                    cancelLabel="Back to maintenance" onSavingChange={onContractorSavingChange} />
                </section>
            )}
        </>
    );
};

export default MaintenanceForm;
