package com.homechart.backend.maintenance.record;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MaintenanceRecordRequest(
        @NotNull
        @Positive
        Long propertyId,

        @NotNull
        @Positive
        Long categoryId,

        @NotBlank
        @Size(max = 100)
        String title,

        @Size(max = 1000)
        String description,

        @NotNull
        @PastOrPresent
        LocalDate completionDate,

        @NotBlank
        @Pattern(regexp = "DIY|Contractor")
        String performedBy,

        @NotNull
        @DecimalMin("0.00")
        @Digits(integer = 8, fraction = 2)
        BigDecimal cost
) {
}