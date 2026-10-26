package com.homechart.backend.maintenance.category;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceCategoryService {

    private final MaintenanceCategoryRepository repository;

    public MaintenanceCategoryService(
            MaintenanceCategoryRepository repository) {
        this.repository = repository;
    }

    public List<MaintenanceCategory> getAllCategories() {
        return repository.findAll();
    }
}