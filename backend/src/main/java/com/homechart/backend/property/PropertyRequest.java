package com.homechart.backend.property;

import jakarta.validation.constraints.*;

public record PropertyRequest(
        @NotNull
        @Positive
        Long userId,

        @NotBlank
        @Size(max = 200)
        String address,

        @NotBlank
        @Size(max = 100)
        String city,

        @NotBlank
        @Pattern(regexp = "[A-Z]{2}")
        String state,

        @Pattern(regexp = "([0-9]{5}(-[0-9]{4})?)?")
        String zipCode,

        @NotNull
        @Min(1000)
        @Max(2100)
        Integer yearBuilt,

        @NotBlank
        @Size(max = 50)
        String propertyType
) {
}