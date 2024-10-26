package com.qw.qwhomes.domains.furniturefamily.dto;

import lombok.Data;

@Data
public class FurnitureFamilyResponseDTO {
    private Long id;
    private String name;
    private Long categoryId;
    private String categoryName;
    private String description;
}
