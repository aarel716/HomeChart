package com.homechart.backend.contractor;

import com.homechart.backend.maintenance.category.MaintenanceCategoryRepository;
import com.homechart.backend.user.User;
import com.homechart.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ContractorService {

    private final ContractorRepository repository;
    private final UserRepository userRepository;
    private final MaintenanceCategoryRepository categoryRepository;

    public ContractorService(ContractorRepository repository,
                             UserRepository userRepository,
                             MaintenanceCategoryRepository categoryRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ContractorResponse> getContractors(Long userId) {
        return repository.findAllForUser(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ContractorResponse createContractor(ContractorRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));

        if (!user.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is inactive");
        }

        Contractor contractor = new Contractor();
        contractor.setUser(user);
        applyDetails(contractor, request);
        return toResponse(repository.save(contractor));
    }

    @Transactional
    public ContractorResponse updateContractor(Long id, ContractorRequest request) {
        Contractor contractor = findContractor(id, request.userId());
        if (!contractor.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Restore the contractor before editing");
        }
        applyDetails(contractor, request);
        return toResponse(repository.save(contractor));
    }

    @Transactional
    public ContractorResponse setContractorActive(Long id, Long userId, boolean isActive) {
        Contractor contractor = findContractor(id, userId);
        contractor.setActive(isActive);
        return toResponse(repository.save(contractor));
    }

    private Contractor findContractor(Long id, Long userId) {
        Contractor contractor = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Contractor not found"));
        if (!contractor.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Contractor not found");
        }
        if (!contractor.getUser().isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is inactive");
        }
        return contractor;
    }

    private void applyDetails(Contractor contractor, ContractorRequest request) {
        contractor.setCategory(categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Maintenance category not found")));
        contractor.setName(request.name().trim());
        contractor.setPhone(request.phone() == null ? "" : request.phone().trim());
        contractor.setEmail(request.email() == null ? "" : request.email().trim());
    }

    private ContractorResponse toResponse(Contractor contractor) {
        return new ContractorResponse(
                contractor.getId(),
                contractor.getUser().getId(),
                contractor.getCategory().getId(),
                contractor.getCategory().getName(),
                contractor.getName(),
                contractor.getPhone(),
                contractor.getEmail(),
                contractor.isActive()
        );
    }
}
