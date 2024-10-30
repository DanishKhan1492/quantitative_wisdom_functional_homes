package com.qw.qwhomes.domains.furniturefamily.controller;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.service.FurnitureFamilyService;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/furniture-families")
public class FurnitureFamilyController {

    private final FurnitureFamilyService furnitureFamilyService;

    public FurnitureFamilyController(FurnitureFamilyService furnitureFamilyService) {
        this.furnitureFamilyService = furnitureFamilyService;
    }

    @PostMapping
    public ResponseEntity<FurnitureFamilyDTO> createFurnitureFamily(@RequestBody FurnitureFamilyDTO furnitureFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureFamily(furnitureFamilyDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FurnitureFamilyDTO> updateFurnitureFamily(@PathVariable Long id, @RequestBody FurnitureFamilyDTO furnitureFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureFamily(id, furnitureFamilyDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFurnitureFamily(@PathVariable Long id) {
        furnitureFamilyService.deleteFurnitureFamily(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FurnitureFamilyDTO> getFurnitureFamily(@PathVariable Long id) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamilyById(id));
    }

    @GetMapping
    public ResponseEntity<List<FurnitureFamilyDTO>> getAllFurnitureFamilies(Pageable pageable) {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureFamilies(pageable));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FurnitureFamilyDTO>> getFurnitureFamiliesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamiliesByCategory(categoryId));
    }

    // FurnitureSubFamily endpoints

    @PostMapping("/{familyId}/sub-families")
    public ResponseEntity<FurnitureSubFamilyResponseDTO> createFurnitureSubFamily(@PathVariable Long familyId, @RequestBody List<FurnitureSubFamilyDTO> furnitureSubFamiliesDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureSubFamily(familyId, furnitureSubFamiliesDTO));
    }

    @PutMapping("/sub-families/{subFamilyId}")
    public ResponseEntity<FurnitureSubFamilyDTO> updateFurnitureSubFamily(@PathVariable Long subFamilyId, @RequestBody FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureSubFamily(subFamilyId, furnitureSubFamilyDTO));
    }

    @DeleteMapping("/sub-families/{subFamilyId}")
    public ResponseEntity<Void> deleteFurnitureSubFamily(@PathVariable Long subFamilyId) {
        furnitureFamilyService.deleteFurnitureSubFamily(subFamilyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sub-families")
    public ResponseEntity<PageableResponse<FurnitureSubFamilyDTO>> getAllSubFamilies(Pageable pageable) {
        return ResponseEntity.ok(furnitureFamilyService.getAllSubFamilies(pageable));
    }

    @GetMapping("/sub-families/{subFamilyId}")
    public ResponseEntity<FurnitureSubFamilyDTO> getFurnitureSubFamily(@PathVariable Long subFamilyId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureSubFamily(subFamilyId));
    }

    @GetMapping("/{familyId}/sub-families")
    public ResponseEntity<List<FurnitureSubFamilyDTO>> getAllFurnitureSubFamilies(@PathVariable Long familyId) {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureSubFamilies(familyId));
    }
}
