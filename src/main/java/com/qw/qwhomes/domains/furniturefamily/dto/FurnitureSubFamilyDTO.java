package com.qw.qwhomes.domains.furniturefamily.dto;

import lombok.Data;

@Data
public class FurnitureSubFamilyDTO {
    private Long id;
    private Long familyId;
    private String name;
    private String type;
    private String description;
}
