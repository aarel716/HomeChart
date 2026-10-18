
interface Property {
    address: string;
    city: string;
    state: string;
    yearBuilt: number;
    propertyType: string;
}

interface PropertyCardProps {
    property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
    return (
        <div className="property-card">
            <h3>My Property</h3>
            <h2>{property.address}</h2>
            <p>{property.city}, {property.state}</p>

            <div className="property-details">
                <p><strong>Year Built:</strong> {property.yearBuilt}</p>
                <p><strong>Property Type:</strong> {property.propertyType}</p>
            </div>
        </div>
    );
};

export default PropertyCard;
