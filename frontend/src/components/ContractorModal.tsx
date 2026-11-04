import { useState } from "react";
import { Modal } from "react-bootstrap";
import ContractorForm from "./ContractorForm";
import type { Contractor, NewContractor } from "../types/Contractor";

interface ContractorModalProps {
    show: boolean;
    darkMode: boolean;
    initialContractor?: Contractor;
    onSave: (values: NewContractor) => Promise<void>;
    onClose: () => void;
}

const ContractorModal = ({ show, darkMode, initialContractor, onSave, onClose }: ContractorModalProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const handleClose = () => { if (!isSaving) onClose(); };
    return (
        <Modal show={show} onHide={handleClose} backdrop={isSaving ? "static" : true}
            keyboard={!isSaving} data-bs-theme={darkMode ? "dark" : "light"}
            aria-labelledby="contractor-modal-title" centered scrollable>
            <Modal.Header closeButton={!isSaving}>
                <Modal.Title id="contractor-modal-title">
                    {initialContractor ? "Edit Contractor" : "Add Contractor"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ContractorForm key={initialContractor?.id ?? "new"}
                    initialContractor={initialContractor} onSave={onSave}
                    onCancel={handleClose} onSavingChange={setIsSaving} />
            </Modal.Body>
        </Modal>
    );
};

export default ContractorModal;
