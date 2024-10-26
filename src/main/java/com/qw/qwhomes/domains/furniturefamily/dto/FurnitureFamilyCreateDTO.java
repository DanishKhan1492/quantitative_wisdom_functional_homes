package com.qw.qwhomes.domains.furniturefamily.dto;

import lombok.Data;
import java.util.List;

@Data
public class FurnitureFamilyCreateDTO {
    private String name;
    private Long categoryId;
    private String description;
    private List<FurnitureSubFamilyDTO> subFamilies;
}
