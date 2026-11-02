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
    ) => Promise<void>;
    onArchiveRecord: (recordId: number) => Promise<void>;
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
    const [actionError, setActionError] = useState("");
    const [isArchiving, setIsArchiving] = useState(false);
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
        setActionError("");
        navigate(`/properties/${id}`);
    };

    const openAddModal = () => {
        setEditingRecord(undefined);
        setMessage("");
        setActionError("");
        setShowModal(true);
    };

    const openEditModal = (record: MaintenanceRecord) => {
        setEditingRecord(record);
        setMessage("");
        setActionError("");
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
                await onUpdateRecord(editingRecord.id, values);
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

    const handleArchive = async (record: MaintenanceRecord): Promise<void> => {
        if (isSaving || isArchiving) {
            return;
        }

        const confirmed = window.confirm(
            `Archive "${record.title}"? It will be hidden from active history and totals, but kept in your records.`
        );
        if (!confirmed) {
            return;
        }

        setMessage("");
        setActionError("");
        setIsArchiving(true);
        try {
            await onArchiveRecord(record.id);
            setMessage(`Archived "${record.title}".`);
        } catch (error) {
            setActionError(error instanceof Error
                ? error.message : "Unable to archive. Please try again.");
        } finally {
            setIsArchiving(false);
        }
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
                    disabled={isSaving || isArchiving}
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

            <p role="status">{isArchiving ? "Archiving record..." : message}</p>
            {actionError && <Alert variant="danger">{actionError}</Alert>}

            <DashboardPage
                key={selectedProperty.id}
                isBusy={isSaving || isArchiving}
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