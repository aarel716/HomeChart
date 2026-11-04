package com.homechart.backend.contractor;

import jakarta.validation.constraints.*;

public record ContractorRequest(
        @NotNull @Positive Long userId,
        @NotNull @Positive Long categoryId,
        @NotBlank @Size(max = 100) String name,
        @Size(max = 30) String phone,
        @Email @Size(max = 254) String email
) {
}
