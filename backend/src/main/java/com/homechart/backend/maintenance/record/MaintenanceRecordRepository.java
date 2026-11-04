package com.homechart.backend.maintenance.record;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaintenanceRecordRepository
        extends JpaRepository<MaintenanceRecord, Long> {

    @Query("""
            SELECT record FROM MaintenanceRecord record
            JOIN FETCH record.category
            JOIN FETCH record.property
            LEFT JOIN FETCH record.contractor
            ORDER BY record.completionDate DESC, record.id DESC
            """)
    List<MaintenanceRecord> findAllWithDetails();
}
