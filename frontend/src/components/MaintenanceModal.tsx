import { Button, Modal } from "react-bootstrap";
import MaintenanceForm from "./MaintenanceForm";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface MaintenanceModalProps {
    show: boolean;
    darkMode: boolean;
    initialRecord?: MaintenanceRecord;
    onClose: () => void;
    onSave: (record: NewMaintenanceRecord) => void;
}

const MaintenanceModal = ({
                              show,
                              darkMode,
                              initialRecord,
                              onClose,
                              onSave,
                          }: MaintenanceModalProps) => {
    return (
        <Modal
            show={show}
            onHide={onClose}
            data-bs-theme={darkMode ? "dark" : "light"}
            aria-labelledby="maintenance-modal-title"
            centered
            scrollable
        >
            <Modal.Header closeButton>
                <Modal.Title id="maintenance-modal-title">
                    {initialRecord ? "Edit Maintenance Record" : "Add Maintenance Record"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <MaintenanceForm
                    key={initialRecord?.id ?? "new"}
                    initialRecord={initialRecord}
                    onSave={onSave}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MaintenanceModal;