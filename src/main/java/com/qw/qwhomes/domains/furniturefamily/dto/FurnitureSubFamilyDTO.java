package com.qw.qwhomes.domains.furniturefamily.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FurnitureSubFamilyDTO {
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long subFamilyId;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long familyId;
    private String name;
    private String type;
    private String description;
}
