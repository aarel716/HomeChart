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
}