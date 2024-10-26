package com.qw.qwhomes.domains.material.controller;

import com.qw.qwhomes.domains.material.dto.MaterialCreateDTO;
import com.qw.qwhomes.domains.material.dto.MaterialResponseDTO;
import com.qw.qwhomes.domains.material.dto.MaterialUpdateDTO;
import com.qw.qwhomes.domains.material.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
@Tag(name = "Material Management", description = "APIs for managing materials")
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new material")
    public ResponseEntity<MaterialResponseDTO> createMaterial(@Valid @RequestBody MaterialCreateDTO createDTO) {
        MaterialResponseDTO responseDTO = materialService.createMaterial(createDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a material by ID")
    public ResponseEntity<MaterialResponseDTO> getMaterialById(@PathVariable Long id) {
        MaterialResponseDTO responseDTO = materialService.getMaterialById(id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @Operation(summary = "Get all materials with pagination")
    public ResponseEntity<Page<MaterialResponseDTO>> getAllMaterials(Pageable pageable) {
        Page<MaterialResponseDTO> materials = materialService.getAllMaterials(pageable);
        return ResponseEntity.ok(materials);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a material")
    public ResponseEntity<MaterialResponseDTO> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialUpdateDTO updateDTO) {
        MaterialResponseDTO responseDTO = materialService.updateMaterial(id, updateDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a material")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
