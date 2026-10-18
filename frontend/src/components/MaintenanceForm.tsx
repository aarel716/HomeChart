import { useState } from "react";
import type { FormEvent } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import type { MaintenanceRecord } from "../types/MaintenanceRecord";

type NewMaintenanceRecord = Omit<MaintenanceRecord, "id">;

interface MaintenanceFormProps {
    onSave: (record: NewMaintenanceRecord) => void;
}

function MaintenanceForm({ onSave }: MaintenanceFormProps) {
    const [error, setError] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);

        const record: NewMaintenanceRecord = {
            title: String(data.get("title") ?? "").trim(),
            date: String(data.get("date") ?? ""),
            cost: Number(data.get("cost")),
            description: String(data.get("description") ?? "").trim(),
        };

        if (!record.title) {
            setError("Enter a maintenance title.");
            return;
        }

        if (!Number.isFinite(record.cost) || record.cost < 0) {
            setError("Enter a valid cost of zero or more.");
            return;
        }

        onSave(record);
        setError("");
        form.reset();
    };

    return (
        <section className="maintenance-card mb-4">
            <h3>Add Maintenance Record</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="maintenance-title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        name="title"
                        type="text"
                        maxLength={100}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="maintenance-date">
                    <Form.Label>Completion date</Form.Label>
                    <Form.Control name="date" type="date" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="maintenance-cost">
                    <Form.Label>Total cost ($)</Form.Label>
                    <Form.Control
                        name="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                    />
                    <Form.Text className="text-body-secondary">
                        Enter 0 if there was no cost.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="maintenance-description">
                    <Form.Label>Description (optional)</Form.Label>
                    <Form.Control
                        name="description"
                        as="textarea"
                        rows={3}
                        maxLength={1000}
                    />
                </Form.Group>

                <Button type="submit">Save Record</Button>
            </Form>
        </section>
    );
}

export default MaintenanceForm;