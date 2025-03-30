package com.qw.qwhomes.domains.apartmenttype.controller;

import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDTO;
import com.qw.qwhomes.domains.apartmenttype.service.ApartmentTypeService;
import com.qw.qwhomes.domains.apartmenttype.service.dto.ApartmentTypeDashboardDTO;
import com.qw.qwhomes.domains.colour.service.dto.ColourDashboardDTO;
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

@RestController
@RequestMapping("/api/v1/apartment-types")
@RequiredArgsConstructor
@Tag(name = "ApartmentType Management", description = "APIs for managing apartment types")
public class ApartmentTypeController {

    private final ApartmentTypeService apartmentTypeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new apartment type")
    public ResponseEntity<ApartmentTypeDTO> createApartmentType(@Valid @RequestBody ApartmentTypeDTO createDTO) {
        ApartmentTypeDTO responseDTO = apartmentTypeService.createApartmentType(createDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get an apartment type by ID")
    public ResponseEntity<ApartmentTypeDTO> getApartmentTypeById(@PathVariable Long id) {
        ApartmentTypeDTO responseDTO = apartmentTypeService.getApartmentTypeById(id);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all apartment types with pagination and search")
    public ResponseEntity<Page<ApartmentTypeDTO>> getAllApartmentTypes(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<ApartmentTypeDTO> apartmentTypes = apartmentTypeService.getAllApartmentTypes(pageable, search);
        return ResponseEntity.ok(apartmentTypes);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an apartment type")
    public ResponseEntity<ApartmentTypeDTO> updateApartmentType(
            @PathVariable Long id,
            @Valid @RequestBody ApartmentTypeDTO apartmentDto) {
        apartmentDto.setApartmentId(id);
        ApartmentTypeDTO responseDTO = apartmentTypeService.updateApartmentType(apartmentDto);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an apartment type")
    public ResponseEntity<Void> deleteApartmentType(@PathVariable Long id) {
        apartmentTypeService.deleteApartmentType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/metadata")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get Apartment Type Metadata")
    public ResponseEntity<ApartmentTypeDashboardDTO> getApartmentTypeMetadata() {
        return ResponseEntity.ok(apartmentTypeService.getApartmentTypeMetadata());
    }
}
