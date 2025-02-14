package com.qw.qwhomes.domains.furniturefamily.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FurnitureSubFamilyDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long subFamilyId;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long familyId;
    private String name;
    private String type;
    private String description;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String familyName;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long createdBy;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime updatedAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long updatedBy;
}
