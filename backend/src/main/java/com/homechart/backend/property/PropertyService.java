package com.homechart.backend.property;

import com.homechart.backend.user.User;
import com.homechart.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyService(
            PropertyRepository propertyRepository,
            UserRepository userRepository
    ) {
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"
                ));

        if (!user.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "User is inactive"
            );
        }

        Property property = new Property();

        property.setUser(user);
        property.setAddress(request.address().trim());
        property.setCity(request.city().trim());
        property.setState(request.state());
        property.setZipCode(request.zipCode());
        property.setYearBuilt(request.yearBuilt());
        property.setPropertyType(request.propertyType().trim());

        Property savedProperty = propertyRepository.save(property);

        return toResponse(savedProperty);
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