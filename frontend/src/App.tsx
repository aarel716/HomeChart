import { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import MaintenanceModal from "./components/MaintenanceModal";
import type { MaintenanceRecord } from "./types/MaintenanceRecord";
import { sampleProperty, sampleRecords } from "./data/sampleData";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [records, setRecords] = useState(sampleRecords);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setMessage("");
    setShowModal(true);
  };

  const addRecord = (newRecord: Omit<MaintenanceRecord, "id">) => {
    setRecords((previousRecords) => {
      const nextId =
          Math.max(0, ...previousRecords.map((record) => record.id)) + 1;

      return [{ ...newRecord, id: nextId }, ...previousRecords];
    });

    setMessage(`Saved "${newRecord.title}".`);
    setShowModal(false);
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
                    <p role="status">{message}</p>
                    <DashboardPage
                        property={sampleProperty}
                        records={records}
                        onAddRecord={openModal}
                    />
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
            onClose={() => setShowModal(false)}
            onSave={addRecord}
        />
      </div>
  );
}

export default App;