package com.qw.qwhomes.domains.apartmenttype.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApartmentTypeRequirementDTO {
    private Long id;

    @NotNull(message = "Family ID is required")
    private Long familyId;

    private Long subFamilyId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private LocalDateTime createdAt;

    private Long createdBy;

    private LocalDateTime updatedAt;

    private Long updatedBy;
}
