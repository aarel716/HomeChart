import type { MaintenanceRecord } from "../types/MaintenanceRecord";

interface MaintenanceListProps {
    records: MaintenanceRecord[];
}

const MaintenanceList = ({ records }: MaintenanceListProps) => {
    return (
        <div className="maintenance-card">
            <h3>Maintenance History</h3>

            {records.length === 0 ? (
                <p>No maintenance records yet.</p>
            ) : (
                <div className="maintenance-list">
                    {records.map((record) => (
                        <div className="maintenance-item" key={record.id}>
                            <div>
                                <h4>{record.title}</h4>
                                <p>{record.date}</p>
                                <p>{record.description}</p>
                            </div>

                            <strong>
                                ${record.cost.toLocaleString()}
                            </strong>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MaintenanceList;
