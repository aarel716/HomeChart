package com.homechart.backend.maintenance.record;

import com.homechart.backend.maintenance.category.MaintenanceCategory;
import com.homechart.backend.maintenance.category.MaintenanceCategoryRepository;
import com.homechart.backend.maintenance.expense.MaintenanceExpense;
import com.homechart.backend.maintenance.expense.MaintenanceExpenseRepository;
import com.homechart.backend.property.Property;
import com.homechart.backend.contractor.Contractor;
import com.homechart.backend.contractor.ContractorRepository;
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
    private final ContractorRepository contractorRepository;

    public MaintenanceRecordService(
            MaintenanceRecordRepository repository,
            PropertyRepository propertyRepository,
            MaintenanceCategoryRepository categoryRepository,
            MaintenanceExpenseRepository expenseRepository,
            ContractorRepository contractorRepository) {
        this.repository = repository;
        this.propertyRepository = propertyRepository;
        this.categoryRepository = categoryRepository;
        this.expenseRepository = expenseRepository;
        this.contractorRepository = contractorRepository;
    }

    public List<MaintenanceRecordResponse> getAllRecords() {
        return repository.findAllWithDetails()
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

        Contractor contractor = selectContractor(request, property, null);

        MaintenanceRecord record = new MaintenanceRecord();
        record.setContractor(contractor);
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

    @Transactional
    public MaintenanceRecordResponse updateRecord(
            Long id, MaintenanceRecordRequest request) {
        MaintenanceRecord record = findRecord(id);

        if (!record.isActive() || !record.getProperty().isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot edit archived maintenance or maintenance on an archived property"
            );
        }

        if (!record.getProperty().getId().equals(request.propertyId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "A maintenance record cannot change properties"
            );
        }

        MaintenanceCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Maintenance category not found"
                ));

        Contractor contractor = selectContractor(request, record.getProperty(), record);

        List<MaintenanceExpense> expenses = expenseRepository
                .findByMaintenanceRecordId(id);

        // Keep itemized expenses safe from the single-total form.
        if (expenses.size() > 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This record has itemized expenses and cannot be edited with the total-cost form"
            );
        }

        record.setContractor(contractor);
        record.setCategory(category);
        record.setTitle(request.title().trim());
        record.setDescription(request.description() == null
                ? null : request.description().trim());
        record.setCompletionDate(request.completionDate());
        record.setPerformedBy(request.performedBy());

        MaintenanceExpense expense = expenses.isEmpty()
                ? new MaintenanceExpense() : expenses.getFirst();
        expense.setMaintenanceRecord(record);
        expense.setDescription("Total job cost");
        expense.setAmount(request.cost());
        expense.setExpenseDate(request.completionDate());

        repository.save(record);
        expenseRepository.save(expense);

        return toResponse(record);
    }

    @Transactional
    public MaintenanceRecordResponse setRecordActive(Long id, boolean isActive) {
        MaintenanceRecord record = findRecord(id);

        if (!record.getProperty().isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Restore the property before changing its maintenance"
            );
        }

        record.setActive(isActive);
        return toResponse(repository.save(record));
    }
    @Transactional
    public void deleteRecord(Long id) {
        MaintenanceRecord record = findRecord(id);

        if (record.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Archive the maintenance record before deleting it"
            );
        }

        List<MaintenanceExpense> expenses =
                expenseRepository.findByMaintenanceRecordId(id);

        expenseRepository.deleteAll(expenses);

        repository.delete(record);
    }

    private Contractor selectContractor(MaintenanceRecordRequest request,
                                        Property property, MaintenanceRecord existingRecord) {
        if ("DIY".equals(request.performedBy())) {
            if (request.contractorId() != null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "DIY work cannot have a contractor");
            }
            return null;
        }

        if (request.contractorId() == null) {
            if (existingRecord != null && existingRecord.getContractor() == null
                    && "Contractor".equals(existingRecord.getPerformedBy())) {
                return null;
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a contractor");
        }

        Contractor contractor = contractorRepository.findById(request.contractorId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contractor not found"));

        if (!contractor.getUser().getId().equals(property.getUser().getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Contractor must belong to the property's owner");
        }

        boolean keepExisting = existingRecord != null && existingRecord.getContractor() != null
                && existingRecord.getContractor().getId().equals(contractor.getId());
        if (!contractor.isActive() && !keepExisting) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select an active contractor");
        }
        return contractor;
    }

    private MaintenanceRecord findRecord(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Maintenance record not found"
                ));
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
                totalCost,
                record.getContractor() == null ? null : record.getContractor().getId(),
                record.getContractor() == null ? null : record.getContractor().getName()
        );
    }
}
