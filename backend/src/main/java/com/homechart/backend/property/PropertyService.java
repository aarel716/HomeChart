package com.homechart.backend.property;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PropertyService {

    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private PropertyResponse toResponse(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getZipCode(),
                property.getYearBuilt(),
                property.getPropertyType(),
                property.isActive(),
                property.getUser().getDisplayName()
        );
    }
}