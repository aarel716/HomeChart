import { Button, Modal } from "react-bootstrap";
import MaintenanceForm from "./MaintenanceForm";
import type {
    MaintenanceRecord,
    NewMaintenanceRecord,
} from "../types/MaintenanceRecord";

interface MaintenanceModalProps {
    show: boolean;
    darkMode: boolean;
    isSaving: boolean;
    initialRecord?: MaintenanceRecord;
    onClose: () => void;
    onSave: (record: NewMaintenanceRecord) => Promise<void>;
}

const MaintenanceModal = ({
                              show,
                              darkMode,
                              isSaving,
                              initialRecord,
                              onClose,
                              onSave,
                          }: MaintenanceModalProps) => {
    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop={isSaving ? "static" : true}
            keyboard={!isSaving}
            data-bs-theme={darkMode ? "dark" : "light"}
            aria-labelledby="maintenance-modal-title"
            centered
            scrollable
        >
            <Modal.Header closeButton={!isSaving}>
                <Modal.Title id="maintenance-modal-title">
                    {initialRecord
                        ? "Edit Maintenance Record"
                        : "Add Maintenance Record"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <MaintenanceForm
                    key={initialRecord?.id ?? "new"}
                    initialRecord={initialRecord}
                    isSaving={isSaving}
                    onSave={onSave}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isSaving}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MaintenanceModal;