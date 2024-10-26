package com.qw.qwhomes.domains.apartmenttype.controller;

import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeCreateDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeResponseDTO;
import com.qw.qwhomes.domains.apartmenttype.dto.ApartmentTypeUpdateDTO;
import com.qw.qwhomes.domains.apartmenttype.service.ApartmentTypeService;
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
@RequestMapping("/api/v1/apartment-types")
@RequiredArgsConstructor
@Tag(name = "ApartmentType Management", description = "APIs for managing apartment types")
public class ApartmentTypeController {

    private final ApartmentTypeService apartmentTypeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new apartment type")
    public ResponseEntity<ApartmentTypeResponseDTO> createApartmentType(@Valid @RequestBody ApartmentTypeCreateDTO createDTO) {
        ApartmentTypeResponseDTO responseDTO = apartmentTypeService.createApartmentType(createDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get an apartment type by ID")
    public ResponseEntity<ApartmentTypeResponseDTO> getApartmentTypeById(@PathVariable Long id) {
        ApartmentTypeResponseDTO responseDTO = apartmentTypeService.getApartmentTypeById(id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all apartment types with pagination and search")
    public ResponseEntity<Page<ApartmentTypeResponseDTO>> getAllApartmentTypes(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<ApartmentTypeResponseDTO> apartmentTypes = apartmentTypeService.getAllApartmentTypes(pageable, search);
        return ResponseEntity.ok(apartmentTypes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an apartment type")
    public ResponseEntity<ApartmentTypeResponseDTO> updateApartmentType(
            @PathVariable Long id,
            @Valid @RequestBody ApartmentTypeUpdateDTO updateDTO) {
        updateDTO.setId(id);
        ApartmentTypeResponseDTO responseDTO = apartmentTypeService.updateApartmentType(updateDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an apartment type")
    public ResponseEntity<Void> deleteApartmentType(@PathVariable Long id) {
        apartmentTypeService.deleteApartmentType(id);
        return ResponseEntity.noContent().build();
    }
}
