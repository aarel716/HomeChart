import {Button} from "react-bootstrap";
import PropertyCard from "../components/PropertyCard";
import type {Property} from "../types/Property";
import MaintenanceList from "../components/MaintenanceList";
import type {MaintenanceRecord} from "../types/MaintenanceRecord";

interface DashboardPageProps {
    isBusy: boolean;
    property: Property;
    records: MaintenanceRecord[];
    onAddRecord: () => void;
    onEditRecord: (record: MaintenanceRecord) => void;
    onArchiveRecord: (record: MaintenanceRecord) => void;
    onRestoreRecord: (record: MaintenanceRecord) => void;
    onDeleteRecord: (record: MaintenanceRecord) => void;

}

const DashboardPage = ({
                           isBusy,
                           property,
                           records,
                           onAddRecord,
                           onEditRecord,
                           onArchiveRecord,
                           onRestoreRecord,
                           onDeleteRecord,
                       }: DashboardPageProps) => {
    const activeRecords = records.filter((record) => record.isActive);
    const totalCost = activeRecords.reduce(
        (total, record) => total + record.cost,
        0
    );

    return (
        <>
            <h2>Property Dashboard</h2>

            <PropertyCard property={property}/>

            <div className="stats">
                <div className="stat-card">
                    <h3>Active Records</h3>
                    <p>{activeRecords.length}</p>
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

            <div className="d-flex flex-wrap gap-2 mb-4">
                <Button onClick={onAddRecord} disabled={isBusy}>Add Maintenance Record</Button>
                <div>
                    <Button>
                        Schedule Maintenance
                    </Button>

                </div>
            </div>

            <MaintenanceList
                isBusy={isBusy}
                records={records}
                onEditRecord={onEditRecord}
                onArchiveRecord={onArchiveRecord}
                onRestoreRecord={onRestoreRecord}
                onDeleteRecord={onDeleteRecord}
            />
        </>
    );
};

export default DashboardPage;
