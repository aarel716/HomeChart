package com.homechart.backend.maintenance.record;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MaintenanceRecordResponse(
        Long id,
        Long propertyId,
        Long categoryId,
        String categoryName,
        String title,
        String description,
        LocalDate completionDate,
        String performedBy,
        boolean isActive,
        BigDecimal cost
) {
}