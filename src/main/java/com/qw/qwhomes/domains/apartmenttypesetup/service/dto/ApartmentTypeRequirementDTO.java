package com.qw.qwhomes.domains.apartmenttypesetup.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApartmentTypeRequirementDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long apartmentTypeRequirementId;

    @NotNull(message = "Apartment Type ID is required")
    private Long apartmentTypeId;

    @NotNull(message = "Family ID is required")
    private Long familyId;

    @NotNull(message = "Sub Family ID is required")
    private Long subFamilyId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String familyName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String subFamilyName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String apartmentTypeName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;
}
