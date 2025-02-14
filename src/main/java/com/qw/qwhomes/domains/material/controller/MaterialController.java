package com.qw.qwhomes.domains.material.controller;

import com.qw.qwhomes.domains.material.service.dto.MaterialDTO;
import com.qw.qwhomes.domains.material.service.MaterialService;
import com.qw.qwhomes.domains.material.service.dto.MaterialDashboardDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
@Tag(name = "Material Management", description = "APIs for managing materials")
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Create a new material")
    public ResponseEntity<MaterialDTO> createMaterial(@Valid @RequestBody MaterialDTO createDTO) {
        MaterialDTO responseDTO = materialService.createMaterial(createDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get a material by ID")
    public ResponseEntity<MaterialDTO> getMaterialById(@PathVariable Long id) {
        MaterialDTO responseDTO = materialService.getMaterialById(id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all materials with pagination")
    public ResponseEntity<Page<MaterialDTO>> getAllMaterials(Pageable pageable) {
        Page<MaterialDTO> materials = materialService.getAllMaterials(pageable);
        return ResponseEntity.ok(materials);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Update a material")
    public ResponseEntity<MaterialDTO> updateMaterial(@PathVariable Long id, @Valid @RequestBody MaterialDTO updateDTO) {
        MaterialDTO responseDTO = materialService.updateMaterial(id, updateDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a material")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metadata")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get materials metadata")
    public ResponseEntity<MaterialDashboardDTO> getMaterialsMetaData() {
        return ResponseEntity.ok(materialService.getMaterialsMetaData());
    }
}
