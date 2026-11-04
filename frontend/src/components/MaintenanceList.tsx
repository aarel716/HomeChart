import { useState } from "react";
import { Badge, Button, Form } from "react-bootstrap";
import type { MaintenanceRecord } from "../types/MaintenanceRecord";

interface MaintenanceListProps {
    isBusy: boolean;
    records: MaintenanceRecord[];
    onEditRecord: (record: MaintenanceRecord) => void;
    onArchiveRecord: (record: MaintenanceRecord) => void;
    onRestoreRecord: (record: MaintenanceRecord) => void;
}

const MaintenanceList = ({
                             isBusy,
                             records,
                             onEditRecord,
                             onArchiveRecord,
                             onRestoreRecord,
                         }: MaintenanceListProps) => {
    const [search, setSearch] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const searchTerm = search.trim().toLowerCase();

    const visibleRecords = records.filter((record) => record.isActive || showArchived);
    const filteredRecords = visibleRecords.filter((record) =>
        `${record.title} ${record.category} ${record.description} ${record.contractorName ?? ""}`
            .toLowerCase()
            .includes(searchTerm)
    );

    return (
        <section className="maintenance-card">
            <h3>Maintenance History</h3>

            <Form.Group className="mb-3" controlId="maintenance-search">
                <Form.Label>Search maintenance</Form.Label>
                <Form.Control
                    type="search"
                    placeholder="Search by title, category, or description"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </Form.Group>

            <Form.Check id="show-archived-maintenance" className="mb-3" label="Show archived maintenance"
                        checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} />

            <p role="status">
                Showing {filteredRecords.length} of {visibleRecords.length} {showArchived ? "total" : "active"} records
            </p>

            {visibleRecords.length === 0 ? (
                <p>No {showArchived ? "" : "active "}maintenance records.</p>
            ) : filteredRecords.length === 0 ? (
                <p>No matching records. Try another search.</p>
            ) : (
                <div className="maintenance-list">
                    {filteredRecords.map((record) => (
                        <div className="maintenance-item" key={record.id}>
                            <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                                <h4>{record.title}</h4>
                                {!record.isActive && <Badge bg="secondary">Archived</Badge>}
                                <p>{record.date}</p>
                                <p>
                                    {record.category} · {record.performedBy}
                                    {record.performedBy === "Contractor" && `: ${record.contractorName ?? "Not recorded"}`}
                                </p>
                                {record.description && <p>{record.description}</p>}
                            </div>

                            <div className="d-flex flex-column align-items-end gap-2">
                                <strong>
                                    {record.cost.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </strong>

                                <div className="d-flex flex-wrap justify-content-end gap-2">
                                    {record.isActive && <Button
                                        disabled={isBusy}
                                        type="button"
                                        variant="outline-primary"
                                        size="sm"
                                        aria-label={`Edit ${record.title}`}
                                        onClick={() => onEditRecord(record)}
                                    >
                                        Edit
                                    </Button>}

                                    <Button
                                        disabled={isBusy}
                                        type="button"
                                        variant="outline-secondary"
                                        size="sm"
                                        aria-label={`${record.isActive ? "Archive" : "Restore"} ${record.title}`}
                                        onClick={() => record.isActive ? onArchiveRecord(record) : onRestoreRecord(record)}
                                    >
                                        {record.isActive ? "Archive" : "Restore"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default MaintenanceList;
