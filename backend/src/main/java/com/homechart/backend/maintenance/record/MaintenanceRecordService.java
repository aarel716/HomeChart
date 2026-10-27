package com.homechart.backend.maintenance.record;

import com.homechart.backend.maintenance.category.MaintenanceCategory;
import com.homechart.backend.maintenance.category.MaintenanceCategoryRepository;
import com.homechart.backend.maintenance.expense.MaintenanceExpense;
import com.homechart.backend.maintenance.expense.MaintenanceExpenseRepository;
import com.homechart.backend.property.Property;
import com.homechart.backend.property.PropertyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository repository;
    private final PropertyRepository propertyRepository;
    private final MaintenanceCategoryRepository categoryRepository;
    private final MaintenanceExpenseRepository expenseRepository;

    public MaintenanceRecordService(
            MaintenanceRecordRepository repository,
            PropertyRepository propertyRepository,
            MaintenanceCategoryRepository categoryRepository,
            MaintenanceExpenseRepository expenseRepository) {
        this.repository = repository;
        this.propertyRepository = propertyRepository;
        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
    }

    public List<MaintenanceRecordResponse> getAllRecords() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MaintenanceRecordResponse createRecord(
            MaintenanceRecordRequest request) {

        Property property = propertyRepository.findById(request.propertyId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Property not found"
                ));

        if (!property.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot add maintenance to an archived property"
            );
        }

        MaintenanceCategory category = categoryRepository
                .findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Maintenance category not found"
                ));

        MaintenanceRecord record = new MaintenanceRecord();
        record.setProperty(property);
        record.setCategory(category);
        record.setTitle(request.title().trim());
        record.setDescription(
                request.description() == null
                        ? null
                        : request.description().trim()
        );
        record.setCompletionDate(request.completionDate());
        record.setPerformedBy(request.performedBy());

        MaintenanceRecord savedRecord = repository.save(record);

        MaintenanceExpense expense = new MaintenanceExpense();
        expense.setMaintenanceRecord(savedRecord);
        expense.setDescription("Total job cost");
        expense.setAmount(request.cost());
        expense.setExpenseDate(request.completionDate());

        expenseRepository.save(expense);

        return toResponse(savedRecord);
    }

    private MaintenanceRecordResponse toResponse(
            MaintenanceRecord record) {

        BigDecimal totalCost = expenseRepository
                .findByMaintenanceRecordId(record.getId())
                .stream()
                .map(MaintenanceExpense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new MaintenanceRecordResponse(
                record.getId(),
                record.getProperty().getId(),
                record.getCategory().getId(),
                record.getCategory().getName(),
                record.getTitle(),
                record.getDescription(),
                record.getCompletionDate(),
                record.getPerformedBy(),
                record.isActive(),
                totalCost
        );
    }
}