import { Modal, Button } from "react-bootstrap";
import MaintenanceForm from "./MaintenanceForm";
import type { MaintenanceRecord } from "../types/MaintenanceRecord";

interface MaintenanceModalProps {
    show: boolean;
    darkMode: boolean;
    onClose: () => void;
    onSave: (record: Omit<MaintenanceRecord, "id">) => void;
}

function MaintenanceModal({
                              show,
                              darkMode,
                              onClose,
                              onSave,
                          }: MaintenanceModalProps) {
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
                    Add Maintenance Record
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <MaintenanceForm onSave={onSave} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default MaintenanceModal;