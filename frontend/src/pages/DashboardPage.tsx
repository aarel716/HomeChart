import { Button } from "react-bootstrap";
import PropertyCard from "../components/PropertyCard";
import type { Property } from "../components/PropertyCard";
import MaintenanceList from "../components/MaintenanceList";
import type { MaintenanceRecord } from "../types/MaintenanceRecord";

interface DashboardPageProps {
    property: Property;
    records: MaintenanceRecord[];
    onAddRecord: () => void;
    onEditRecord: (record: MaintenanceRecord) => void;
    onArchiveRecord: (record: MaintenanceRecord) => void;
}

const DashboardPage = ({
                           property,
                           records,
                           onAddRecord,
                           onEditRecord,
                           onArchiveRecord,
                       }: DashboardPageProps) => {
    const totalCost = records.reduce(
        (total, record) => total + record.cost,
        0
    );

    return (
        <>
            <h2>Property Dashboard</h2>

            <PropertyCard property={property} />

            <div className="stats">
                <div className="stat-card">
                    <h3>Active Records</h3>
                    <p>{records.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Active Maintenance Cost</h3>
                    <p>
                        {totalCost.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </p>
                </div>
            </div>

            <Button className="mb-4" onClick={onAddRecord}>
                Add Maintenance Record
            </Button>

            <MaintenanceList
                records={records}
                onEditRecord={onEditRecord}
                onArchiveRecord={onArchiveRecord}
            />
        </>
    );
};

export default DashboardPage;