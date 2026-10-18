import { useState } from "react";
import PropertyCard from "./components/PropertyCard";
import MaintenanceList from "./components/MaintenanceList";
import MaintenanceForm from "./components/MaintenanceForm";
import type { MaintenanceRecord } from "./types/MaintenanceRecord";
import { sampleProperty, sampleRecords } from "./data/sampleData";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [records, setRecords] = useState(sampleRecords);
  const [message, setMessage] = useState("");

  const addRecord = (newRecord: Omit<MaintenanceRecord, "id">) => {
    setRecords((previousRecords) => {
      const nextId =
          Math.max(0, ...previousRecords.map((record) => record.id)) + 1;

      return [{ ...newRecord, id: nextId }, ...previousRecords];
    });

    setMessage(`Saved "${newRecord.title}".`);
  };

  const totalCost = records.reduce(
      (total, record) => total + record.cost,
      0
  );

  return (
      <div
          className={`app ${darkMode ? "dark" : "light"}`}
          data-bs-theme={darkMode ? "dark" : "light"}
      >
        <header className="header">
          <div>
            <h1>HomeChart</h1>
            <p>Your home's maintenance history in one place.</p>
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
          <h2>Property Dashboard</h2>

          <PropertyCard property={sampleProperty} />

          <div className="stats">
            <div className="stat-card">
              <h3>Total Records</h3>
              <p>{records.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Maintenance Cost</h3>
              <p>
                {totalCost.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
            </div>
          </div>

          <MaintenanceForm onSave={addRecord} />

          <p role="status">{message}</p>

          <MaintenanceList records={records} />
        </main>
      </div>
  );
}

export default App;