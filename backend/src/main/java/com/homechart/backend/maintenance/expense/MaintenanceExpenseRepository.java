package com.homechart.backend.maintenance.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceExpenseRepository
        extends JpaRepository<MaintenanceExpense, Long> {

    List<MaintenanceExpense> findByMaintenanceRecordId(Long maintenanceRecordId);
}