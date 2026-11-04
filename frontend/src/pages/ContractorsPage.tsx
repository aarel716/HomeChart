import { useState } from "react";
import { Alert, Badge, Button, Form } from "react-bootstrap";
import ContractorModal from "../components/ContractorModal";
import type { Contractor, NewContractor } from "../types/Contractor.ts";

interface ContractorsPageProps {
    darkMode: boolean;
    contractors: Contractor[];
    isLoading: boolean;
    error: string;
    onAddContractor: (values: NewContractor) => Promise<Contractor>;
    onUpdateContractor: (id: number, values: NewContractor) => Promise<void>;
    onChangeStatus: (id: number, isActive: boolean) => Promise<void>;
}

const ContractorsPage = ({ darkMode, contractors, isLoading, error,
    onAddContractor, onUpdateContractor, onChangeStatus }: ContractorsPageProps) => {
    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingContractor, setEditingContractor] = useState<Contractor>();
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const openModal = (contractor?: Contractor) => {
        setEditingContractor(contractor);
        setMessage("");
        setActionError("");
        setShowModal(true);
    };

    const handleSave = async (values: NewContractor) => {
        if (editingContractor) await onUpdateContractor(editingContractor.id, values);
        else await onAddContractor(values);
        setMessage(`Saved "${values.name}".`);
        setShowModal(false);
    };

    const handleStatus = async (contractor: Contractor) => {
        if (isBusy) return;
        if (contractor.isActive && !window.confirm(
            `Archive "${contractor.name}"? Their existing maintenance history will be kept.`
        )) return;
        setIsBusy(true);
        setMessage("");
        setActionError("");
        try {
            await onChangeStatus(contractor.id, !contractor.isActive);
            setMessage(`${contractor.isActive ? "Archived" : "Restored"} "${contractor.name}".`);
        } catch (error) {
            setActionError(error instanceof Error ? error.message : "Unable to update contractor.");
        } finally {
            setIsBusy(false);
        }
    };

    const filteredContractors = contractors
        .filter((item) => (item.isActive || showArchived)
            && `${item.name} ${item.categoryName}`.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <>
            <h2>Contractors</h2>
            <p>Save contractors to use across your properties.</p>
            {isLoading ? <p role="status">Loading contractors...</p> : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <Button className="mb-3" disabled={isBusy} onClick={() => openModal()}>Add Contractor</Button>
                    <Form.Group className="mb-3" controlId="contractor-search">
                        <Form.Label>Search contractors</Form.Label>
                        <Form.Control type="search" placeholder="Search by name or specialty" value={search}
                            onChange={(event) => setSearch(event.target.value)} />
                    </Form.Group>
                    <Form.Check className="mb-3" id="show-archived-contractors" label="Show archived contractors"
                        checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} />
                    <p role="status">{isBusy ? "Updating contractor..." : message}</p>
                    {actionError && <Alert variant="danger">{actionError}</Alert>}
                    {filteredContractors.length === 0 && <p>No contractors found.</p>}
                    <div className="contractor-grid">
                        {filteredContractors.map((contractor) => (
                            <article className="contractor-card" key={contractor.id}>
                                <h3>{contractor.name}</h3>
                                {!contractor.isActive && <Badge bg="secondary" className="mb-2">Archived</Badge>}
                                <p>{contractor.categoryName}</p>
                                {contractor.phone && <p>Phone: {contractor.phone}</p>}
                                {contractor.email && <p>Email: {contractor.email}</p>}
                                <div className="d-flex flex-wrap gap-2">
                                    {contractor.isActive && <Button variant="outline-primary" disabled={isBusy}
                                        aria-label={`Edit ${contractor.name}`} onClick={() => openModal(contractor)}>Edit</Button>}
                                    <Button variant="outline-secondary" disabled={isBusy}
                                        aria-label={`${contractor.isActive ? "Archive" : "Restore"} ${contractor.name}`}
                                        onClick={() => handleStatus(contractor)}>
                                        {contractor.isActive ? "Archive" : "Restore"}
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                </>
            )}
            <ContractorModal show={showModal} darkMode={darkMode} initialContractor={editingContractor}
                onSave={handleSave} onClose={() => setShowModal(false)} />
        </>
    );
};

export default ContractorsPage;
