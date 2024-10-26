package com.qw.qwhomes.domains.furniturefamily.controller;

import com.qw.qwhomes.domains.furniturefamily.service.FurnitureFamilyService;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyCreateDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.dto.FurnitureSubFamilyDTO;
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
    public ResponseEntity<FurnitureFamilyResponseDTO> createFurnitureFamily(@RequestBody FurnitureFamilyCreateDTO furnitureFamilyCreateDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureFamily(furnitureFamilyCreateDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FurnitureFamilyResponseDTO> updateFurnitureFamily(@PathVariable Long id, @RequestBody FurnitureFamilyCreateDTO furnitureFamilyCreateDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureFamily(id, furnitureFamilyCreateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFurnitureFamily(@PathVariable Long id) {
        furnitureFamilyService.deleteFurnitureFamily(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FurnitureFamilyResponseDTO> getFurnitureFamily(@PathVariable Long id) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamilyById(id));
    }

    @GetMapping
    public ResponseEntity<List<FurnitureFamilyResponseDTO>> getAllFurnitureFamilies() {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureFamilies());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<FurnitureFamilyResponseDTO>> getFurnitureFamiliesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamiliesByCategory(categoryId));
    }

    // FurnitureSubFamily endpoints

    @PostMapping("/{familyId}/sub-families")
    public ResponseEntity<FurnitureSubFamilyDTO> createFurnitureSubFamily(@PathVariable Long familyId, @RequestBody FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureSubFamily(familyId, furnitureSubFamilyDTO));
    }

    @PutMapping("/{familyId}/sub-families/{subFamilyId}")
    public ResponseEntity<FurnitureSubFamilyDTO> updateFurnitureSubFamily(@PathVariable Long familyId, @PathVariable Long subFamilyId, @RequestBody FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureSubFamily(familyId, subFamilyId, furnitureSubFamilyDTO));
    }

    @DeleteMapping("/{familyId}/sub-families/{subFamilyId}")
    public ResponseEntity<Void> deleteFurnitureSubFamily(@PathVariable Long familyId, @PathVariable Long subFamilyId) {
        furnitureFamilyService.deleteFurnitureSubFamily(familyId, subFamilyId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{familyId}/sub-families/{subFamilyId}")
    public ResponseEntity<FurnitureSubFamilyDTO> getFurnitureSubFamily(@PathVariable Long familyId, @PathVariable Long subFamilyId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureSubFamily(familyId, subFamilyId));
    }

    @GetMapping("/{familyId}/sub-families")
    public ResponseEntity<List<FurnitureSubFamilyDTO>> getAllFurnitureSubFamilies(@PathVariable Long familyId) {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureSubFamilies(familyId));
    }
}
