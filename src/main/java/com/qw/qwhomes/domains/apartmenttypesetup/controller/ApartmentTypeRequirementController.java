package com.qw.qwhomes.domains.apartmenttypesetup.controller;

import com.qw.qwhomes.domains.apartmenttypesetup.service.ApartmentTypeRequirementService;
import com.qw.qwhomes.domains.apartmenttypesetup.service.dto.ApartmentTypeRequirementDTO;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/apartment-type-requirements")
@RequiredArgsConstructor
@Tag(name = "ApartmentType Requirement Management", description = "APIs for managing apartment type requirements")
public class ApartmentTypeRequirementController {

    private final ApartmentTypeRequirementService apartmentTypeRequirementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new apartment type requirement")
    public ResponseEntity<ApartmentTypeRequirementDTO> createApartmentType(@Valid @RequestBody ApartmentTypeRequirementDTO apartmentTypeRequirementDTO) {
        ApartmentTypeRequirementDTO responseDTO = apartmentTypeRequirementService.createApartmentTypeRequirement(apartmentTypeRequirementDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get an apartment type requirement by ID")
    public ResponseEntity<ApartmentTypeRequirementDTO> getApartmentTypeById(@PathVariable Long id) {
        ApartmentTypeRequirementDTO responseDTO = apartmentTypeRequirementService.getApartmentTypeRequirementById(id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all apartment type requirements with pagination and search")
    public ResponseEntity<Page<ApartmentTypeRequirementDTO>> getAllApartmentTypes(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<ApartmentTypeRequirementDTO> apartmentTypes = apartmentTypeRequirementService.getAllApartmentTypeRequirements(pageable, search);
        return ResponseEntity.ok(apartmentTypes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an apartment type requirement")
    public ResponseEntity<ApartmentTypeRequirementDTO> updateApartmentType(
            @PathVariable Long id,
            @Valid @RequestBody ApartmentTypeRequirementDTO apartmentDto) {
        apartmentDto.setApartmentTypeRequirementId(id);
        ApartmentTypeRequirementDTO responseDTO = apartmentTypeRequirementService.updateApartmentTypeRequirement(apartmentDto);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an apartment type requirement")
    public ResponseEntity<Void> deleteApartmentType(@PathVariable Long id) {
        apartmentTypeRequirementService.deleteApartmentTypeRequirement(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{apartment-id}/families-and-sub-families")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get apartment type families and sub families")
    public ResponseEntity<Map<Long, Object>> getApartmentTypeFamiliesAndSubFamilies(@PathVariable("apartment-id") Long id) {
        return ResponseEntity.ok(apartmentTypeRequirementService.getApartmentTypeFamiliesAndSubFamilies(id));
    }
}
