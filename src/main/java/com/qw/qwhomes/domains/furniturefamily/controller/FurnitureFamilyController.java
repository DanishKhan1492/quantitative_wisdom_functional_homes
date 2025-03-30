package com.qw.qwhomes.domains.furniturefamily.controller;

import com.qw.qwhomes.common.dto.PageableResponse;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureFamilyAndSubFamilyDashboardDTO;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureFamilyDTO;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureSubFamilyResponseDTO;
import com.qw.qwhomes.domains.furniturefamily.service.FurnitureFamilyService;
import com.qw.qwhomes.domains.furniturefamily.service.dto.FurnitureSubFamilyDTO;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/furniture-families")
public class FurnitureFamilyController {

    private final FurnitureFamilyService furnitureFamilyService;

    public FurnitureFamilyController(FurnitureFamilyService furnitureFamilyService) {
        this.furnitureFamilyService = furnitureFamilyService;
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping
    @Operation(summary = "Create a new furniture family")
    public ResponseEntity<FurnitureFamilyDTO> createFurnitureFamily(@RequestBody FurnitureFamilyDTO furnitureFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureFamily(furnitureFamilyDTO));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/{id}")
    @Operation(summary = "Update a furniture family")
    public ResponseEntity<FurnitureFamilyDTO> updateFurnitureFamily(@PathVariable Long id, @RequestBody FurnitureFamilyDTO furnitureFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureFamily(id, furnitureFamilyDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a furniture family")
    public ResponseEntity<Void> deleteFurnitureFamily(@PathVariable Long id) {
        furnitureFamilyService.deleteFurnitureFamily(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{id}")
    @Operation(summary = "Get a furniture family by ID")
    public ResponseEntity<FurnitureFamilyDTO> getFurnitureFamily(@PathVariable Long id) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamilyById(id));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping
    @Operation(summary = "Get all furniture families with pagination")
    public ResponseEntity<Page<FurnitureFamilyDTO>> getAllFurnitureFamilies(Pageable pageable) {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureFamilies(pageable));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get all furniture families by category")
    public ResponseEntity<List<FurnitureFamilyDTO>> getFurnitureFamiliesByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamiliesByCategory(categoryId));
    }

    // FurnitureSubFamily endpoints
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/{familyId}/sub-families")
    @Operation(summary = "Create a new furniture sub family")
    public ResponseEntity<FurnitureSubFamilyResponseDTO> createFurnitureSubFamily(@PathVariable Long familyId, @RequestBody List<FurnitureSubFamilyDTO> furnitureSubFamiliesDTO) {
        return ResponseEntity.ok(furnitureFamilyService.createFurnitureSubFamily(familyId, furnitureSubFamiliesDTO));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/sub-families/{subFamilyId}")
    @Operation(summary = "Update a furniture sub family")
    public ResponseEntity<FurnitureSubFamilyDTO> updateFurnitureSubFamily(@PathVariable Long subFamilyId, @RequestBody FurnitureSubFamilyDTO furnitureSubFamilyDTO) {
        return ResponseEntity.ok(furnitureFamilyService.updateFurnitureSubFamily(subFamilyId, furnitureSubFamilyDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/sub-families/{subFamilyId}")
    @Operation(summary = "Delete a furniture sub family")
    public ResponseEntity<Void> deleteFurnitureSubFamily(@PathVariable Long subFamilyId) {
        furnitureFamilyService.deleteFurnitureSubFamily(subFamilyId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/sub-families")
    @Operation(summary = "Get all furniture sub families with pagination")
    public ResponseEntity<PageableResponse<FurnitureSubFamilyDTO>> getAllSubFamilies(Pageable pageable) {
        return ResponseEntity.ok(furnitureFamilyService.getAllSubFamilies(pageable));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/sub-families/{subFamilyId}")
    @Operation(summary = "Get a furniture sub family by ID")
    public ResponseEntity<FurnitureSubFamilyDTO> getFurnitureSubFamily(@PathVariable Long subFamilyId) {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureSubFamily(subFamilyId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{familyId}/sub-families")
    @Operation(summary = "Get all furniture sub families by family")
    public ResponseEntity<List<FurnitureSubFamilyDTO>> getAllFurnitureSubFamilies(@PathVariable Long familyId) {
        return ResponseEntity.ok(furnitureFamilyService.getAllFurnitureSubFamilies(familyId));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/metadata")
    @Operation(summary = "Get furniture family and sub family metadata for Dashboard")
    public ResponseEntity<FurnitureFamilyAndSubFamilyDashboardDTO> getFurnitureFamilyAndSubFamilyMetaData() {
        return ResponseEntity.ok(furnitureFamilyService.getFurnitureFamilyAndSubFamilyMetaData());
    }
}
