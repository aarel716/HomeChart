package com.homechart.backend.maintenance.record;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceRecordRepository
        extends JpaRepository<MaintenanceRecord, Long> {
}