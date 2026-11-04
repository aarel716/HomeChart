package com.homechart.backend.contractor;

public record ContractorResponse(
        Long id,
        Long userId,
        Long categoryId,
        String categoryName,
        String name,
        String phone,
        String email,
        boolean isActive
) {
}
