import {useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {Alert, Spinner} from "react-bootstrap";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import PropertyPage from "./pages/PropertyPage";
import {useProperties} from "./hooks/useProperties";
import {useMaintenanceRecords} from "./hooks/useMaintenanceRecords";
import "./App.css";

const App = () => {
    const [darkMode, setDarkMode] = useState(true);
    const {
        properties,
        isLoading,
        error,
        addProperty,
        archiveProperty,
        restoreProperty,
    } = useProperties();

    const {
        records,
        addRecord,
        updateRecord,
        archiveRecord,
    } = useMaintenanceRecords();

    return (
        <div
            className={`app ${darkMode ? "dark" : "light"}`}
            data-bs-theme={darkMode ? "dark" : "light"}
        >
            <Header
                darkMode={darkMode}
                onToggleTheme={() =>
                    setDarkMode((previousMode) => !previousMode)
                }
            />

            <main className="dashboard">
                {isLoading && (
                    <div role="status" className="d-flex align-items-center gap-2">
                        <Spinner animation="border" size="sm" aria-hidden="true"/>
                        <span>Loading properties...</span>
                    </div>
                )}

                {error && <Alert variant="danger">{error}</Alert>}

                {!isLoading && !error && (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomePage
                                    darkMode={darkMode}
                                    properties={properties}
                                    onAddProperty={addProperty}
                                    onArchiveProperty={archiveProperty}
                                    onRestoreProperty={restoreProperty}
                                />
                            }
                        />
                        <Route
                            path="/properties/:propertyId"
                            element={
                                <PropertyPage
                                    darkMode={darkMode}
                                    properties={properties.filter(
                                        (property) => property.isActive
                                    )}
                                    records={records}
                                    onAddRecord={addRecord}
                                    onUpdateRecord={updateRecord}
                                    onArchiveRecord={archiveRecord}
                                />
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
                )}
            </main>
        </div>
    );
};

export default App;