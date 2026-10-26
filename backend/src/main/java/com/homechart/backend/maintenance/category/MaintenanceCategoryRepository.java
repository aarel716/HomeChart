package com.homechart.backend.maintenance.category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceCategoryRepository
        extends JpaRepository<MaintenanceCategory, Long> {
}