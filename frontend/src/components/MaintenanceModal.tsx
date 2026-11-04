import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import type { Contractor, NewContractor } from "../types/Contractor";
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
    contractors: Contractor[];
    contractorsLoading: boolean;
    contractorsError: string;
    onAddContractor: (values: NewContractor) => Promise<Contractor>;
    onClose: () => void;
    onSave: (record: NewMaintenanceRecord) => Promise<void>;
}

const MaintenanceModal = ({
                              contractors,
                              contractorsLoading,
                              contractorsError,
                              onAddContractor,
                              show,
                              darkMode,
                              isSaving,
                              initialRecord,
                              onClose,
                              onSave,
                          }: MaintenanceModalProps) => {
    const [isCreatingContractor, setIsCreatingContractor] = useState(false);
    const isBusy = isSaving || isCreatingContractor;
    const handleClose = () => {
        if (!isBusy) {
            onClose();
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop={isBusy ? "static" : true}
            keyboard={!isBusy}
            data-bs-theme={darkMode ? "dark" : "light"}
            aria-labelledby="maintenance-modal-title"
            centered
            scrollable
        >
            <Modal.Header closeButton={!isBusy}>
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
                    onContractorSavingChange={setIsCreatingContractor}
                    contractors={contractors}
                    contractorsLoading={contractorsLoading}
                    contractorsError={contractorsError}
                    onAddContractor={onAddContractor}
                    onSave={onSave}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isBusy}
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MaintenanceModal;
