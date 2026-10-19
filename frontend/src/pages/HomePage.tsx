import { useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropertyModal from "../components/PropertyModal";
import type { NewProperty, Property } from "../types/Property";

interface HomePageProps {
    darkMode: boolean;
    properties: Property[];
    onAddProperty: (values: NewProperty) => void;
    onArchiveProperty: (propertyId: number) => void;
    onRestoreProperty: (propertyId: number) => void;
}

const HomePage = ({
                      darkMode,
                      properties,
                      onAddProperty,
                      onArchiveProperty,
                      onRestoreProperty,
                  }: HomePageProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [message, setMessage] = useState("");

    const visibleProperties = properties.filter(
        (property) => property.isActive || showArchived
    );

    const handleSave = (values: NewProperty) => {
        onAddProperty(values);
        setShowModal(false);
        setMessage(`Added "${values.address}".`);
    };

    const openModal = () => {
        setMessage("");
        setShowModal(true);
    };

    const handleArchive = (property: Property) => {
        const confirmed = window.confirm(
            `Archive "${property.address}"? Its maintenance history will be kept, and you can restore it later.`
        );

        if (!confirmed) {
            return;
        }

        onArchiveProperty(property.id);
        setMessage(`Archived "${property.address}".`);
    };

    const handleRestore = (property: Property) => {
        onRestoreProperty(property.id);
        setMessage(`Restored "${property.address}".`);
    };

    return (
        <>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <h2 className="mb-0">My Properties</h2>

                <Button onClick={openModal}>
                    Add Property
                </Button>
            </div>

            <p>Select a property to view its maintenance history.</p>

            <Form.Check
                id="show-archived-properties"
                type="checkbox"
                label="Show archived properties"
                checked={showArchived}
                onChange={(event) =>
                    setShowArchived(event.target.checked)
                }
                className="mb-3"
            />

            <p role="status">{message}</p>

            {visibleProperties.length === 0 ? (
                <p>
                    No properties to display. Add a property or enable
                    “Show archived properties.”
                </p>
            ) : (
                <Row className="g-3">
                    {visibleProperties.map((property) => (
                        <Col key={property.id} xs={12} md={6}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title as="h3" className="h5 text-break">
                                        {property.address}
                                    </Card.Title>

                                    {!property.isActive && (
                                        <Badge bg="secondary" className="mb-2">
                                            Archived
                                        </Badge>
                                    )}

                                    <Card.Text>
                                        {property.city}, {property.state}
                                        {property.zipCode && ` ${property.zipCode}`}
                                    </Card.Text>

                                    <Card.Text>
                                        {property.propertyType}
                                        <br />
                                        Built in {property.yearBuilt}
                                    </Card.Text>

                                    {property.isActive ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            <Link
                                                to={`/properties/${property.id}`}
                                                className="btn btn-outline-primary"
                                                aria-label={`View maintenance for ${property.address}`}
                                            >
                                                View Maintenance
                                            </Link>

                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => handleArchive(property)}
                                                aria-label={`Archive ${property.address}`}
                                            >
                                                Archive
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => handleRestore(property)}
                                            aria-label={`Restore ${property.address}`}
                                        >
                                            Restore
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <PropertyModal
                show={showModal}
                darkMode={darkMode}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
            />
        </>
    );
};

export default HomePage;