package com.qw.qwhomes.domains.furniturefamily.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class FurnitureFamilyDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long familyId;
    private String name;
    private Long categoryId;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String categoryName;
    private String description;
    private List<FurnitureSubFamilyDTO> subFamilies;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<Long> removedSubFamilies;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;
}
