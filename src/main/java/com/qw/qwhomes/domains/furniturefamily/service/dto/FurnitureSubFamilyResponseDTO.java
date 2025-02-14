package com.qw.qwhomes.domains.furniturefamily.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FurnitureSubFamilyResponseDTO {
    private List<FurnitureSubFamilyDTO> furnitureSubFamilies;
    private String duplicateSubFamiliesName;
}
