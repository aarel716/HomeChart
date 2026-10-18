import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import type { MaintenanceRecord } from "../types/MaintenanceRecord";

interface MaintenanceListProps {
    records: MaintenanceRecord[];
    onEditRecord: (record: MaintenanceRecord) => void;
    onArchiveRecord: (record: MaintenanceRecord) => void;
}

const MaintenanceList = ({
                             records,
                             onEditRecord,
                             onArchiveRecord,
                         }: MaintenanceListProps) => {
    const [search, setSearch] = useState("");
    const searchTerm = search.trim().toLowerCase();

    const filteredRecords = records.filter((record) =>
        `${record.title} ${record.category} ${record.description}`
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

            <p role="status">
                Showing {filteredRecords.length} of {records.length} active records
            </p>

            {records.length === 0 ? (
                <p>No active maintenance records.</p>
            ) : filteredRecords.length === 0 ? (
                <p>No matching records. Try another search.</p>
            ) : (
                <div className="maintenance-list">
                    {filteredRecords.map((record) => (
                        <div className="maintenance-item" key={record.id}>
                            <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                                <h4>{record.title}</h4>
                                <p>{record.date}</p>
                                <p>
                                    {record.category} · {record.performedBy}
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
                                    <Button
                                        type="button"
                                        variant="outline-primary"
                                        size="sm"
                                        aria-label={`Edit ${record.title}`}
                                        onClick={() => onEditRecord(record)}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        size="sm"
                                        aria-label={`Archive ${record.title}`}
                                        onClick={() => onArchiveRecord(record)}
                                    >
                                        Archive
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