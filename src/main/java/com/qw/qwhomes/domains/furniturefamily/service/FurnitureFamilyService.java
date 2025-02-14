package com.qw.qwhomes.domains.furniturefamily.service;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureFamilyAndSubFamilyDashboardDTO;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureSubFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureSubFamilyResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FurnitureFamilyService {
    FurnitureFamilyDTO createFurnitureFamily(FurnitureFamilyDTO furnitureFamilyDTO);
    FurnitureFamilyDTO updateFurnitureFamily(Long id, FurnitureFamilyDTO furnitureFamilyDTO);
    void deleteFurnitureFamily(Long id);
    FurnitureFamilyDTO getFurnitureFamilyById(Long id);
    Page<FurnitureFamilyDTO> getAllFurnitureFamilies(Pageable pageable);
    List<FurnitureFamilyDTO> getFurnitureFamiliesByCategory(Long categoryId);

    // Methods for FurnitureSubFamily
    FurnitureSubFamilyResponseDTO createFurnitureSubFamily(Long familyId, List<FurnitureSubFamilyDTO> furnitureSubFamilyDTO);
    FurnitureSubFamilyDTO updateFurnitureSubFamily(Long subFamilyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO);
    void deleteFurnitureSubFamily(Long subFamilyId);
    FurnitureSubFamilyDTO getFurnitureSubFamily(Long subFamilyId);
    List<FurnitureSubFamilyDTO> getAllFurnitureSubFamilies(Long familyId);

    PageableResponse<FurnitureSubFamilyDTO> getAllSubFamilies(Pageable pageable);

    FurnitureFamilyAndSubFamilyDashboardDTO getFurnitureFamilyAndSubFamilyMetaData();
}
