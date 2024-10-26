package com.qw.qwhomes.domains.furniturefamily.service;

import com.qw.qwhomes.domains.furniturefamily.data.entity.FurnitureSubFamily;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyCreateDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FurnitureFamilyService {
    FurnitureFamilyResponseDTO createFurnitureFamily(FurnitureFamilyCreateDTO furnitureFamilyCreateDTO);
    FurnitureFamilyResponseDTO updateFurnitureFamily(Long id, FurnitureFamilyCreateDTO furnitureFamilyCreateDTO);
    void deleteFurnitureFamily(Long id);
    FurnitureFamilyResponseDTO getFurnitureFamilyById(Long id);
    List<FurnitureFamilyResponseDTO> getAllFurnitureFamilies();
    List<FurnitureFamilyResponseDTO> getFurnitureFamiliesByCategory(Long categoryId);

    // Methods for FurnitureSubFamily
    FurnitureSubFamilyDTO createFurnitureSubFamily(Long familyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO);
    FurnitureSubFamilyDTO updateFurnitureSubFamily(Long familyId, Long subFamilyId, FurnitureSubFamilyDTO furnitureSubFamilyDTO);
    void deleteFurnitureSubFamily(Long familyId, Long subFamilyId);
    FurnitureSubFamilyDTO getFurnitureSubFamily(Long familyId, Long subFamilyId);
    List<FurnitureSubFamilyDTO> getAllFurnitureSubFamilies(Long familyId);
}
