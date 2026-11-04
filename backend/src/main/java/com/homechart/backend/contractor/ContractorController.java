package com.homechart.backend.contractor;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contractors")
public class ContractorController {

    private final ContractorService service;

    public ContractorController(ContractorService service) {
        this.service = service;
    }

    @GetMapping
    public List<ContractorResponse> getContractors(@RequestParam Long userId) {
        return service.getContractors(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContractorResponse createContractor(@Valid @RequestBody ContractorRequest request) {
        return service.createContractor(request);
    }

    @PutMapping("/{id}")
    public ContractorResponse updateContractor(@PathVariable Long id,
                                               @Valid @RequestBody ContractorRequest request) {
        return service.updateContractor(id, request);
    }

    @PatchMapping("/{id}/active")
    public ContractorResponse setContractorActive(@PathVariable Long id,
                                                  @RequestParam Long userId,
                                                  @RequestParam boolean isActive) {
        return service.setContractorActive(id, userId, isActive);
    }
}
