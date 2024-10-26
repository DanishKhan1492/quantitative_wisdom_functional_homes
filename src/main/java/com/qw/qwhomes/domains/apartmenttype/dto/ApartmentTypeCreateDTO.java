package com.qw.qwhomes.domains.apartmenttype.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ApartmentTypeCreateDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Number of bedrooms is required")
    @Positive(message = "Number of bedrooms must be positive")
    private Integer numberOfBedrooms;

    private String description;

    @Positive(message = "Minimum floor area must be positive")
    private BigDecimal floorAreaMin;

    @Positive(message = "Maximum floor area must be positive")
    private BigDecimal floorAreaMax;

    private Set<ApartmentTypeRequirementDTO> requirements;

    private LocalDateTime createdAt;

    private Long createdBy;

    private LocalDateTime updatedAt;

    private Long updatedBy;

}
