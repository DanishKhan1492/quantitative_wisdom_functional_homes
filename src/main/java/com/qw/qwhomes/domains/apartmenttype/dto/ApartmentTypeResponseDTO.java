package com.qw.qwhomes.domains.apartmenttype.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ApartmentTypeResponseDTO {
    private Long id;
    private String name;
    private Long categoryId;
    private String categoryName;
    private Integer numberOfBedrooms;
    private String description;
    private BigDecimal floorAreaMin;
    private BigDecimal floorAreaMax;
    private Set<ApartmentTypeRequirementDTO> requirements;
    private LocalDateTime createdAt;
    private Long createdBy;
    private LocalDateTime updatedAt;
    private Long updatedBy;
}
