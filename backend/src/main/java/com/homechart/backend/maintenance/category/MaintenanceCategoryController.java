package com.homechart.backend.maintenance.category;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-categories")
public class MaintenanceCategoryController {

    private final MaintenanceCategoryService service;

    public MaintenanceCategoryController(
            MaintenanceCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<MaintenanceCategory> getAllCategories() {
        return service.getAllCategories();
    }
}