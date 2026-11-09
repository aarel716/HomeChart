package com.homechart.backend.maintenance.record;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-records")
public class MaintenanceRecordController {

    private final MaintenanceRecordService service;

    public MaintenanceRecordController(
            MaintenanceRecordService service) {
        this.service = service;
    }

    @GetMapping
    public List<MaintenanceRecordResponse> getAllRecords() {
        return service.getAllRecords();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceRecordResponse createRecord(
            @Valid @RequestBody MaintenanceRecordRequest request) {
        return service.createRecord(request);
    }

    @PutMapping("/{id}")
    public MaintenanceRecordResponse updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody MaintenanceRecordRequest request) {
        return service.updateRecord(id, request);
    }

    @PatchMapping("/{id}/active")
    public MaintenanceRecordResponse setRecordActive(
            @PathVariable Long id,
            @RequestParam boolean isActive) {
        return service.setRecordActive(id, isActive);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
    }
}
