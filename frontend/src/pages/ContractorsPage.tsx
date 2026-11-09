
import { useState } from "react";
import { Alert, Badge, Button, Form, Table } from "react-bootstrap";
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

const ContractorsPage = ({
                             darkMode,
                             contractors,
                             isLoading,
                             error,
                             onAddContractor,
                             onUpdateContractor,
                             onChangeStatus
                         }: ContractorsPageProps) => {

    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingContractor, setEditingContractor] = useState<Contractor>();
    const [isBusy, setIsBusy] = useState(false);
    const [message, setMessage] = useState("");
    const [actionError, setActionError] = useState("");

    const [sortBy, setSortBy] = useState<"name" | "categoryName">("name");
    const [sortAsc, setSortAsc] = useState(true);

    const openModal = (contractor?: Contractor) => {
        setEditingContractor(contractor);
        setMessage("");
        setActionError("");
        setShowModal(true);
    };

    const handleSave = async (values: NewContractor) => {
        if (editingContractor) {
            await onUpdateContractor(editingContractor.id, values);
        } else {
            await onAddContractor(values);
        }

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

            setMessage(
                `${contractor.isActive ? "Archived" : "Restored"} "${contractor.name}".`
            );
        } catch (error) {
            setActionError(
                error instanceof Error
                    ? error.message
                    : "Unable to update contractor."
            );
        } finally {
            setIsBusy(false);
        }
    };

    const handleSort = (column: "name" | "categoryName") => {
        if (sortBy === column) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    const filteredContractors = contractors
        .filter((contractor) =>
            (contractor.isActive || showArchived) &&
            `${contractor.name} ${contractor.categoryName} ${contractor.phone ?? ""} ${contractor.email ?? ""}`
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        )
        .sort((a, b) => {
            const result = a[sortBy].localeCompare(b[sortBy]);
            return sortAsc ? result : -result;
        });

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Contractors</h2>
                    <p>Manage your home service providers.</p>
                </div>

                <Button
                    disabled={isBusy || isLoading}
                    onClick={() => openModal()}
                >
                    Add Contractor
                </Button>
            </div>

            {isLoading ? (
                <p role="status">Loading contractors...</p>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                        <Form.Group controlId="contractor-search" style={{ flex: "1 1 250px" }}>
                            <Form.Label>Search contractors</Form.Label>
                            <Form.Control
                                type="search"
                                placeholder="Search by name, specialty, phone or email"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-2"
                            id="show-archived-contractors"
                            label="Show archived contractors"
                            checked={showArchived}
                            onChange={(event) => setShowArchived(event.target.checked)}
                        />
                    </div>

                    <p role="status">
                        {isBusy ? "Updating contractor..." : message}
                    </p>

                    {actionError && (
                        <Alert variant="danger">{actionError}</Alert>
                    )}

                    <p className="text-muted small">
                        Showing {filteredContractors.length} contractors
                    </p>

                    <div className="table-responsive">
                        <Table
                            striped
                            bordered
                            hover
                            size="sm"
                            variant={darkMode ? "dark" : undefined}
                            className="align-middle"
                        >
                            <thead>
                            <tr>
                                <th
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSort("name")}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handleSort("name");
                                        }
                                    }}
                                >
                                    Name
                                </th>
                                <th
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSort("categoryName")}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handleSort("categoryName");
                                        }
                                    }}
                                >
                                    Specialty
                                </th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredContractors.map((contractor) => (
                                <tr key={contractor.id}>
                                    <td>{contractor.name}</td>
                                    <td>{contractor.categoryName}</td>
                                    <td>{contractor.phone || "—"}</td>
                                    <td>{contractor.email || "—"}</td>
                                    <td>
                                        <Badge bg={contractor.isActive ? "success" : "secondary"}>
                                            {contractor.isActive ? "Active" : "Archived"}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            {contractor.isActive && (
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    disabled={isBusy}
                                                    onClick={() => openModal(contractor)}
                                                >
                                                    Edit
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                disabled={isBusy}
                                                onClick={() => handleStatus(contractor)}
                                            >
                                                {contractor.isActive ? "Archive" : "Restore"}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredContractors.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        No contractors found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                </>
            )}

            <ContractorModal
                show={showModal}
                darkMode={darkMode}
                initialContractor={editingContractor}
                onSave={handleSave}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default ContractorsPage;
