import { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import MaintenanceModal from "./components/MaintenanceModal";
import type {
  MaintenanceRecord,
  NewMaintenanceRecord,
} from "./types/MaintenanceRecord";
import { sampleProperties, sampleRecords } from "./data/sampleData";
import "./App.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [records, setRecords] = useState(sampleRecords);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
      sampleProperties[0].id
  );
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] =
      useState<MaintenanceRecord | undefined>(undefined);

  const selectedProperty = sampleProperties.find(
      (property) => property.id === selectedPropertyId
  );

  const propertyRecords = records.filter(
      (record) =>
          record.propertyId === selectedPropertyId && record.isActive
  );

  const selectProperty = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setEditingRecord(undefined);
    setMessage("");
  };

  const openAddModal = () => {
    setEditingRecord(undefined);
    setMessage("");
    setShowModal(true);
  };

  const openEditModal = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setMessage("");
    setShowModal(true);
  };

  const saveRecord = (values: NewMaintenanceRecord) => {
    setRecords((previousRecords) => {
      if (editingRecord) {
        return previousRecords.map((record) =>
            record.id === editingRecord.id
                ? { ...record, ...values }
                : record
        );
      }

      const nextId =
          Math.max(0, ...previousRecords.map((record) => record.id)) + 1;

      const newRecord: MaintenanceRecord = {
        ...values,
        id: nextId,
        propertyId: selectedPropertyId,
        isActive: true,
      };

      return [newRecord, ...previousRecords];
    });

    setMessage(
        `${editingRecord ? "Updated" : "Added"} "${values.title}".`
    );
    setShowModal(false);
  };

  const archiveRecord = (recordToArchive: MaintenanceRecord) => {
    const confirmed = window.confirm(
        `Archive "${recordToArchive.title}"? It will be hidden from active history and totals, but kept in your records.`
    );

    if (!confirmed) {
      return;
    }

    setRecords((previousRecords) =>
        previousRecords.map((record) =>
            record.id === recordToArchive.id
                ? { ...record, isActive: false }
                : record
        )
    );

    setMessage(`Archived "${recordToArchive.title}".`);
  };

  return (
      <div
          className={`app ${darkMode ? "dark" : "light"}`}
          data-bs-theme={darkMode ? "dark" : "light"}
      >
        <header className="header">
          <div>
            <h1>HomeChart</h1>
            <p>Your home's maintenance history in one place.</p>
            <Link to="/" className="text-white">
              Dashboard
            </Link>
          </div>

          <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode((previousMode) => !previousMode)}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </header>

        <main className="dashboard">
          <Routes>
            <Route
                path="/"
                element={
                  <>
                    <Form.Group className="mb-4" controlId="property-select">
                      <Form.Label>Select property</Form.Label>
                      <Form.Select
                          value={selectedPropertyId}
                          onChange={(event) =>
                              selectProperty(Number(event.target.value))
                          }
                      >
                        {sampleProperties.map((property) => (
                            <option key={property.id} value={property.id}>
                              {property.address} — {property.city}
                            </option>
                        ))}
                      </Form.Select>
                    </Form.Group>

                    <p role="status">{message}</p>

                    {selectedProperty ? (
                        <DashboardPage
                            key={selectedProperty.id}
                            property={selectedProperty}
                            records={propertyRecords}
                            onAddRecord={openAddModal}
                            onEditRecord={openEditModal}
                            onArchiveRecord={archiveRecord}
                        />
                    ) : (
                        <p>Select a property to view its maintenance history.</p>
                    )}
                  </>
                }
            />

            <Route
                path="*"
                element={
                  <>
                    <h2>Page not found</h2>
                    <Link to="/">Return to Dashboard</Link>
                  </>
                }
            />
          </Routes>
        </main>

        <MaintenanceModal
            show={showModal}
            darkMode={darkMode}
            initialRecord={editingRecord}
            onClose={() => setShowModal(false)}
            onSave={saveRecord}
        />
      </div>
  );
};

export default App;