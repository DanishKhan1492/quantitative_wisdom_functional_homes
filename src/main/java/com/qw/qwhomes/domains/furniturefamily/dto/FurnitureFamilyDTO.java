package com.qw.qwhomes.domains.furniturefamily.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
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

}
