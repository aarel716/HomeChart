package com.homechart.backend.property;

public record PropertyResponse(
        Long id,
        String address,
        String city,
        String state,
        String zipCode,
        Integer yearBuilt,
        String propertyType,
        boolean isActive,
        String ownerName
) {
}