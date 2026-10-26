import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useMaintenanceCategories } from "../hooks/useMaintenanceCategories";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface MaintenanceFormProps {
    initialRecord?: MaintenanceRecord;
    onSave: (record: NewMaintenanceRecord) => void;
}

const MaintenanceForm = ({
                             initialRecord,
                             onSave,
                         }: MaintenanceFormProps) => {
    const [error, setError] = useState("");
    const {
        categories,
        isLoading,
        error: categoryError,
    } = useMaintenanceCategories();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);

        const title = String(data.get("title") ?? "").trim();
        const category = String(data.get("category") ?? "");
        const performedBy = data.get("performedBy");
        const cost = Number(data.get("cost"));

        if (!title) {
            setError("Enter a maintenance title.");
            return;
        }

        if (!categories.some((item) => item.name === category)) {
            setError("Select a maintenance category.");
            return;
        }

        if (performedBy !== "DIY" && performedBy !== "Contractor") {
            setError("Select who performed the work.");
            return;
        }

        if (!Number.isFinite(cost) || cost < 0) {
            setError("Enter a valid cost of zero or more.");
            return;
        }

        onSave({
            title,
            category,
            performedBy,
            cost,
            date: String(data.get("date") ?? ""),
            description: String(data.get("description") ?? "").trim(),
        });

        setError("");
        form.reset();
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

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="maintenance-title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        defaultValue={initialRecord?.title ?? ""}
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="maintenance-category">
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
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <fieldset className="mb-3">
                    <legend className="fs-6">Who performed the work?</legend>
                    <Form.Check
                        inline
                        type="radio"
                        id="performed-by-diy"
                        name="performedBy"
                        label="DIY"
                        value="DIY"
                        defaultChecked={initialRecord?.performedBy === "DIY"}
                        required
                    />
                    <Form.Check
                        inline
                        type="radio"
                        id="performed-by-contractor"
                        name="performedBy"
                        label="Contractor"
                        value="Contractor"
                        defaultChecked={
                            initialRecord?.performedBy === "Contractor"
                        }
                        required
                    />
                </fieldset>

                <Form.Group className="mb-3" controlId="maintenance-date">
                    <Form.Label>Completion date</Form.Label>
                    <Form.Control
                        name="date"
                        type="date"
                        defaultValue={initialRecord?.date ?? ""}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="maintenance-cost">
                    <Form.Label>Total cost ($)</Form.Label>
                    <Form.Control
                        name="cost"
                        type="number"
                        defaultValue={initialRecord?.cost ?? ""}
                        min="0"
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

                <Button type="submit">
                    {initialRecord ? "Save Changes" : "Save Record"}
                </Button>
            </Form>
        </>
    );
};

export default MaintenanceForm;