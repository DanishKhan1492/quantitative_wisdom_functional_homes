package com.qw.qwhomes.domains.apartmenttype.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApartmentTypeDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long apartmentId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Number of bedrooms is required")
    @Positive(message = "Number of bedrooms must be positive")
    private Integer numberOfBedrooms;

    private String description;

    @Positive(message = "Minimum floor area must be positive")
    private Double floorAreaMin;

    @Positive(message = "Maximum floor area must be positive")
    private Double floorAreaMax;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String categoryName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;

}
