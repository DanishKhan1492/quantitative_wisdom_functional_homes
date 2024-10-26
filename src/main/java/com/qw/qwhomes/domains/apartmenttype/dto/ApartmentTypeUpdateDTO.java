package com.qw.qwhomes.domains.apartmenttype.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class ApartmentTypeUpdateDTO {
    @NotNull(message = "ID is required")
    private Long id;

    private String name;
    private Long categoryId;
    private Integer numberOfBedrooms;
    private String description;

    @Positive(message = "Minimum floor area must be positive")
    private BigDecimal floorAreaMin;

    @Positive(message = "Maximum floor area must be positive")
    private BigDecimal floorAreaMax;

    private Set<ApartmentTypeRequirementDTO> requirements;
}
