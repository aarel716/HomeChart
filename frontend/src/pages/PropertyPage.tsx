import { useState } from "react";
import { Alert, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import MaintenanceModal from "../components/MaintenanceModal";
import type { Property } from "../types/Property";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface PropertyPageProps {
    darkMode: boolean;
    properties: Property[];
    records: MaintenanceRecord[];
    isLoading: boolean;
    error: string;
    onAddRecord: (
        values: NewMaintenanceRecord,
        propertyId: number
    ) => Promise<void>;
    onUpdateRecord: (
        recordId: number,
        values: NewMaintenanceRecord
    ) => void;
    onArchiveRecord: (recordId: number) => void;
}

const PropertyPage = ({
                          darkMode,
                          properties,
                          records,
                          isLoading,
                          error,
                          onAddRecord,
                          onUpdateRecord,
                          onArchiveRecord,
                      }: PropertyPageProps) => {
    const { propertyId } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingRecord, setEditingRecord] =
        useState<MaintenanceRecord | undefined>(undefined);

    const selectedProperty = properties.find(
        (property) => property.id === Number(propertyId)
    );

    const propertyRecords = records.filter(
        (record) =>
            record.propertyId === Number(propertyId) && record.isActive
    );

    const selectProperty = (id: number) => {
        setEditingRecord(undefined);
        setShowModal(false);
        setMessage("");
        navigate(`/properties/${id}`);
    };

    const openAddModal = () => {
        setEditingRecord(undefined);
        setMessage("");
        setShowModal(true);
    };

    const openEditModal = (record: MaintenanceRecord) => {
        setEditingRecord(record);
        setMessage("");
        setShowModal(true);
    };

    const handleSave = async (
        values: NewMaintenanceRecord
    ): Promise<void> => {
        if (!selectedProperty) {
            throw new Error("Property not found.");
        }

        setIsSaving(true);

        try {
            if (editingRecord) {
                onUpdateRecord(editingRecord.id, values);
            } else {
                await onAddRecord(values, selectedProperty.id);
            }

            setMessage(
                `${editingRecord ? "Updated" : "Added"} "${values.title}".`
            );
            setShowModal(false);
        } finally {
            setIsSaving(false);
        }
    };

    const handleArchive = (record: MaintenanceRecord) => {
        const confirmed = window.confirm(
            `Archive "${record.title}"? It will be hidden from active history and totals, but kept in your records.`
        );

        if (!confirmed) {
            return;
        }

        onArchiveRecord(record.id);
        setMessage(`Archived "${record.title}".`);
    };

    if (!selectedProperty) {
        return (
            <>
                <h2>Property not found</h2>
                <Link to="/">Return to My Properties</Link>
            </>
        );
    }

    if (isLoading) {
        return (
            <>
                <Link to="/" className="d-inline-block mb-3">
                    Back to My Properties
                </Link>

                <div
                    role="status"
                    className="d-flex align-items-center gap-2"
                >
                    <Spinner
                        animation="border"
                        size="sm"
                        aria-hidden="true"
                    />
                    <span>Loading maintenance records...</span>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Link to="/">Back to My Properties</Link>
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            </>
        );
    }

    return (
        <>
            <Link to="/" className="d-inline-block mb-3">
                Back to My Properties
            </Link>

            <Form.Group className="mb-4" controlId="property-select">
                <Form.Label>Select property</Form.Label>

                <Form.Select
                    value={selectedProperty.id}
                    disabled={isSaving}
                    onChange={(event) =>
                        selectProperty(Number(event.target.value))
                    }
                >
                    {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                            {property.address} — {property.city}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <p role="status">{message}</p>

            <DashboardPage
                key={selectedProperty.id}
                property={selectedProperty}
                records={propertyRecords}
                onAddRecord={openAddModal}
                onEditRecord={openEditModal}
                onArchiveRecord={handleArchive}
            />

            <MaintenanceModal
                show={showModal}
                darkMode={darkMode}
                isSaving={isSaving}
                initialRecord={editingRecord}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />
        </>
    );
};

export default PropertyPage;